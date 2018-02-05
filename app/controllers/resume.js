/* eslint eqeqeq: "off" */
import config from 'config';
import Resume from '../models/resumes';
import User from '../models/users';
import ResumePub from '../models/resume-pub';
import ShareAnalyse from '../models/share-analyse';
import getCacheKey from './helper/cacheKey';
import Downloads from '../services/downloads';
import dateHelper from '../utils/date';
import { getGithubSections, getMobileMenu } from './shared';
import logger from '../utils/logger';
import SlackMsg from '../services/slack';
import {
  formatObject
} from '../utils/helper';

/* ===================== private ===================== */

const URL = config.get('url');
const HTTPS_URL = config.get('httpsUrl');

const getResumeShareStatus = (findPubResume, locale) => {
  const { result, success, message } = findPubResume;
  if (!success) {
    return {
      error: message,
      success: true,
      result: null
    };
  }

  const {
    github,
    template,
    useGithub,
    resumeHash,
    openShare,
  } = result;
  return {
    success: true,
    result: {
      github,
      template,
      openShare,
      useGithub,
      resumeHash,
      url: `resume/${resumeHash}?locale=${locale}`,
      githubUrl: null
    }
  };
};

/* ===================== router handler ===================== */

const getResume = async (ctx) => {
  const { userId } = ctx.session;
  const getResult = await Resume.findOne(userId);
  const { result } = getResult;

  ctx.body = {
    result,
    success: true,
  };
};

const setResume = async (ctx, next) => {
  const { resume } = ctx.request.body;
  const { userId, githubLogin } = ctx.session;

  const targetResume = formatObject(resume);
  const setResult = await Resume.reset(userId, targetResume, ctx.cache);

  logger.info(`[RESUME:UPDATE][${githubLogin}]`);

  if (resume.info && resume.info.email) {
    User.updateUserInfo({
      userId,
      email: resume.info.email,
    });
  }
  let resumeInfo = null;
  if (setResult.success) {
    // check & add resume share info
    let checkResult = await ResumePub.findOne({ userId });
    if (!checkResult.success) {
      checkResult = await ResumePub.addPubResume(userId);
    }
    resumeInfo = checkResult.success ? {
      useGithub: checkResult.result.useGithub,
      openShare: checkResult.result.openShare,
      url: `resume/${checkResult.result.resumeHash}?locale=${ctx.session.locale}`,
    } : null;
  }

  const checkPubResume = await ResumePub.findOne({ userId });
  if (checkPubResume.success) {
    const hash = checkPubResume.result.resumeHash;
    const cacheKey = getCacheKey(ctx);
    ctx.query.deleteKeys = [
      cacheKey(`resume.${hash}`)
    ];
  }

  new SlackMsg(ctx.mq).send({
    type: 'resume',
    data: `Resume create or update by <https://github.com/${githubLogin}|${githubLogin}>`
  });

  ctx.body = {
    success: true,
    message: ctx.__('messages.success.save'),
    result: resumeInfo
  };

  await next();
};

const downloadResume = async (ctx) => {
  const { userId, githubLogin } = ctx.session;
  const checkPubResume = await ResumePub.findOne({ userId });
  if (!checkPubResume.success) {
    ctx.body = {
      error: ctx.__('messages.error.resume'),
      success: true
    };
    return;
  }
  const hash = checkPubResume.result.resumeHash;
  const { result } = await ResumePub.getUpdateTime(hash);
  const seconds = dateHelper.getSeconds(result);

  const resumeUrl =
    `${HTTPS_URL}/resume/${hash}?locale=${ctx.session.locale}&userId=${userId}&notrace=true`;

  new SlackMsg(ctx.mq).send({
    type: 'download',
    data: `【${githubLogin}:${hash}】`
  });

  logger.info(`[RESUME:DOWNLOAD][${resumeUrl}]`);
  ctx.cache.hincrby('resume', 'download', 1);

  let resultUrl = '';
  try {
    resultUrl = await Downloads.resume(resumeUrl, {
      folder: githubLogin,
      title: `${seconds}-resume.pdf`
    });
  } catch (e) {
    logger.error(`[RESUME:DOWNLOAD:ERROR]${e}`);
  }

  ctx.body = {
    result: resultUrl,
    success: true
  };
};

const _resumePage = async (ctx, hash) => {
  const { isMobile } = ctx.state;
  const { isAdmin, userName, userLogin } = ctx.query;
  if (isMobile) {
    await ctx.render('user/mobile/resume', {
      title: ctx.__('resumePage.title', userName),
      resumeHash: hash,
      login: userLogin,
      menu: getMobileMenu(ctx),
      user: {
        isAdmin,
        login: userLogin,
      },
      hideFooter: true,
    });
  } else {
    await ctx.render('resume/share', {
      title: ctx.__('resumePage.title', userName),
      resumeHash: hash,
      login: userLogin,
      hideFooter: true
    });
  }
};

const resumePage = async (ctx) => {
  const { hash } = ctx.query;
  await _resumePage(ctx, hash);
};

const getPubResume = async (ctx, next) => {
  const { hash } = ctx.query;
  const findResume = await ResumePub.getPubResume(hash);
  const { result, success } = findResume;
  const error = success ? '' : ctx.__('messages.error.resume');

  ctx.body = {
    result,
    error,
    success: true,
  };

  await next();
};

const getPubResumePage = async (ctx) => {
  const { hash } = ctx.params;
  await _resumePage(ctx, hash);
};

const getPubResumeHash = async (ctx, next) => {
  const { hash } = ctx.query;
  ctx.body = {
    result: hash,
    success: true,
  };
  await next();
};

const getPubResumeStatus = async (ctx) => {
  const { hash } = ctx.params;
  const { fromDownload, locale } = ctx.session;
  const findPubResume = await ResumePub.findByHash(hash);
  const shareResult = getResumeShareStatus(findPubResume, locale);

  const { success, result } = shareResult;
  if (success && result && fromDownload) {
    const { userId } = findPubResume.result;
    const user = await User.findOne({ userId });
    shareResult.result.githubUrl =
      `${URL}/github/${user.githubLogin}?locale=${locale}`;
  }

  ctx.body = shareResult;
};

const getResumeStatus = async (ctx) => {
  const { userId, locale } = ctx.session;
  const findPubResume = await ResumePub.findOne({ userId });

  ctx.body = getResumeShareStatus(findPubResume, locale);
};

const setHireAvailable = async (ctx, next) => {
  const { userId } = ctx.session;
  const { hireAvailable } = ctx.request.body;
  await Resume.update({
    target: {
      resume: {
        info: { hireAvailable }
      }
    },
    userId,
  });

  const checkPubResume = await ResumePub.findOne({ userId });
  if (checkPubResume.success) {
    const hash = checkPubResume.result.resumeHash;
    const cacheKey = getCacheKey(ctx);
    ctx.query.deleteKeys = [
      cacheKey(`resume.${hash}`)
    ];
  }

  ctx.body = {
    success: true,
    message: ctx.__('messages.resume.hireAvailable')
  };

  await next();
};

const setResumeShareStatus = async (ctx) => {
  const { enable } = ctx.request.body;
  const { userId } = ctx.session;

  await ResumePub.updatePubResume(userId, {
    openShare: enable
  });
  const resultMessage = Boolean(enable) == true
    ? 'messages.share.toggleOpen'
    : 'messages.share.toggleClose';
  ctx.body = {
    success: true,
    message: ctx.__(resultMessage)
  };
};

const setResumeShareTemplate = async (ctx) => {
  const { template } = ctx.request.body;
  const { userId } = ctx.session;

  await ResumePub.updatePubResume(userId, { template });
  ctx.body = {
    success: true,
    result: template,
    message: ctx.__('messages.resume.template'),
  };
};

const setResumeGithubStatus = async (ctx) => {
  const { enable } = ctx.request.body;
  const { userId } = ctx.session;

  await ResumePub.updatePubResume(userId, {
    useGithub: enable
  });
  const resultMessage = Boolean(enable) == true
    ? 'messages.resume.linkGithub'
    : 'messages.resume.unlinkGithub';
  ctx.body = {
    success: true,
    message: ctx.__(resultMessage)
  };
};

const setGithubShareSection = async (ctx) => {
  const { userId } = ctx.session;
  const githubSections = getGithubSections(ctx.request.body);

  await ResumePub.updatePubResume(userId, {
    github: githubSections
  });
  ctx.body = {
    success: true
  };
};

const getShareRecords = async (ctx) => {
  const { userId } = ctx.session;
  const findPubResume = await ResumePub.findOne({ userId });
  const { result, success, message } = findPubResume;
  if (!success) {
    ctx.body = {
      error: message,
      success: true,
      result: {
        url: '',
        viewDevices: [],
        viewSources: [],
        pageViews: [],
        openShare: false
      }
    };
    return;
  }

  const shareAnalyse =
    await ShareAnalyse.findOne({
      url: `resume/${result.resumeHash}`,
      userId
    });
  const { viewDevices, viewSources, pageViews } = shareAnalyse;
  ctx.body = {
    success: true,
    result: {
      url: `resume/${result.resumeHash}?locale=${ctx.session.locale}`,
      openShare: result.openShare,
      viewDevices,
      viewSources,
      pageViews,
    }
  };
};

export default {
  getResume,
  setResume,
  downloadResume,
  getPubResume,
  resumePage,
  getPubResumeHash,
  getPubResumePage,
  getResumeStatus,
  getPubResumeStatus,
  setResumeShareStatus,
  setResumeShareTemplate,
  setResumeGithubStatus,
  setGithubShareSection,
  getShareRecords,
  setHireAvailable,
};

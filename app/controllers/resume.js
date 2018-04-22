/* eslint eqeqeq: "off", guard-for-in: "off" */

import config from 'config';
// import ShareAnalyse from '../models/share-analyse';
import getCacheKey from './helper/cacheKey';
import Downloads from '../services/downloads';
import dateHelper from '../utils/date';
// import { getGithubSections } from './shared';
import logger from '../utils/logger';
import notify from '../services/notify';
import {
  formatObject
} from '../utils/helper';
import UserAPI from '../services/user';

/* ===================== private ===================== */

// const URL = config.get('url');
const HTTPS_URL = config.get('httpsUrl');

const getResumeShareStatus = (resumeInfo, locale) => {
  // TODO:
  // migrate. old resume pub has no login data
  const {
    login,
    github,
    template,
    useGithub,
    resumeHash,
    openShare,
    simplifyUrl,
  } = resumeInfo;

  return {
    github,
    locale,
    template,
    openShare,
    useGithub,
    resumeHash,
    simplifyUrl,
    githubUrl: null,
    url: simplifyUrl && login
      ? `${login}/resume?locale=${locale}`
      : `resume/${resumeHash}?locale=${locale}`
  };
};

/* ===================== router handler ===================== */

const getResume = async (ctx) => {
  const { userId } = ctx.session;
  const resume = await UserAPI.getResume({ userId });

  ctx.body = {
    result: resume,
    success: true,
  };
};

const setResume = async (ctx, next) => {
  const { resume } = ctx.request.body;
  const { userId, githubLogin } = ctx.session;

  const targetResume = formatObject(resume);
  const result = await UserAPI.updateResume({
    userId,
    login: githubLogin,
    resume: targetResume
  });

  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey(`resume.${result.hash}`)
  ];
  logger.info(`[RESUME:UPDATE][${githubLogin}]`);

  notify('slack').send({
    mq: ctx.mq,
    data: {
      type: 'resume',
      data: `Resume create or update by <https://github.com/${githubLogin}|${githubLogin}>`
    }
  });

  ctx.body = {
    result,
    success: true,
    message: ctx.__('messages.success.save'),
  };

  await next();
};

const patchResume = async (ctx, next) => {
  const { userId, githubLogin } = ctx.session;
  const resume = await UserAPI.getResume({ userId });

  for (const key in ctx.request.body) {
    const data = ctx.request.body[key];

    for (const k of data) {
      resume[key][k] = data[k];
    }
  }

  const result = await UserAPI.updateResume({
    userId,
    resume,
    login: githubLogin,
  });

  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey(`resume.${result.hash}`)
  ];

  ctx.body = {
    result,
    success: true,
  };

  await next();
};

const downloadResume = async (ctx) => {
  const { userId, githubLogin, locale } = ctx.session;

  const result = await UserAPI.getResumeInfo({ userId });
  const { template, resumeHash } = result;

  const resume = await UserAPI.getResume({ userId });
  const updateTime = resume.updated_at;
  const seconds = dateHelper.getSeconds(updateTime);

  const resumeUrl =
    `${HTTPS_URL}/resume/${resumeHash}?locale=${locale}&userId=${userId}&notrace=true`;

  notify('slack').send({
    mq: ctx.mq,
    data: {
      type: 'download',
      data: `【${githubLogin}:${resumeHash}】`
    }
  });

  logger.info(`[RESUME:DOWNLOAD][${resumeUrl}]`);
  ctx.cache.hincrby('resume', 'download', 1);

  let resultUrl = '';
  try {
    resultUrl = await Downloads.resume(resumeUrl, {
      folder: githubLogin,
      title: `${template}-${locale}-${seconds}-resume.pdf`
    });
  } catch (e) {
    logger.error(`[RESUME:DOWNLOAD:ERROR]${e}`);
  }

  ctx.body = {
    result: resultUrl,
    success: true
  };
};

const resumePage = async (ctx) => {
  const { resumeInfo } = ctx;
  const { login } = resumeInfo;
  const user = await UserAPI.getUser({ login });

  const { isMobile } = ctx.state;
  const { fromDownload, githubLogin } = ctx.session;
  const isAdmin = login === githubLogin;
  const { userName, userId } = user;

  if (isMobile) {
    await ctx.render('user/mobile/resume', {
      title: ctx.__('resumePage.title', userName),
      login,
      userId,
      fromDownload,
      user: {
        login,
        isAdmin,
      },
      hideFooter: true,
    });
  } else {
    await ctx.render('resume/share', {
      login,
      userId,
      fromDownload,
      hideFooter: true,
      title: ctx.__('resumePage.title', userName),
    });
  }
};

const getResumeByHash = async (ctx, next) => {
  const { hash } = ctx.query;
  const result = await UserAPI.getResume({ hash });

  ctx.body = {
    result,
    success: true,
  };

  await next();
};

const getResumeInfo = async (ctx) => {
  const { hash, userId } = ctx.query;
  const { locale } = ctx.session;
  const qs = {};
  if (hash) {
    qs.hash = hash;
  } else if (userId) {
    qs.userId = userId;
  } else {
    qs.userId = ctx.session.userId;
  }
  const resumeInfo = await UserAPI.getResumeInfo(qs);

  let result = null;
  if (resumeInfo) {
    result = getResumeShareStatus(resumeInfo, locale);
  }
  ctx.body = {
    result,
    success: true,
  };
};

// TODO:
// migrate to redis
const getShareRecords = async (ctx) => {
  const { githubLogin } = ctx.session;
  ctx.body = {
    success: true,
    result: {
      pageViews: [],
      viewDevices: [],
      viewSources: [],
      openShare: false,
      url: `${githubLogin}/resume?locale=${ctx.session.locale}`,
    }
  };

  // const findPubResume = await ResumePub.findOne({ userId });
  // const { result, success, message } = findPubResume;
  // if (!success) {
  //   ctx.body = {
  //     error: message,
  //     success: true,
  //     result: {
  //       url: '',
  //       viewDevices: [],
  //       viewSources: [],
  //       pageViews: [],
  //       openShare: false
  //     }
  //   };
  //   return;
  // }

  // const shareAnalyses =
  //   await ShareAnalyse.find({
  //     userId,
  //     url: new RegExp('resume'),
  //   });
  // const viewDevices = [];
  // const viewSources = [];
  // const pageViews = [];
  // for (let i = 0; i < shareAnalyses.length; i += 1) {
  //   const shareAnalyse = shareAnalyses[i];
  //   viewDevices.push(...shareAnalyse.viewDevices);
  //   viewSources.push(...shareAnalyse.viewSources);
  //   pageViews.push(...shareAnalyse.pageViews);
  // }
  // ctx.body = {
  //   success: true,
  //   result: {
  //     pageViews,
  //     viewDevices,
  //     viewSources,
  //     openShare: result.openShare,
  //     url: `${githubLogin}/resume?locale=${ctx.session.locale}`,
  //   }
  // };
};

const setResumeInfo = async (ctx) => {
  const { info } = ctx.request.body;
  const { userId, githubLogin } = ctx.session;

  const result = await UserAPI.setResumeInfo({
    info,
    userId,
    login: githubLogin
  });

  ctx.body = {
    result,
    success: true,
  };
};

export default {
  // ============
  getResume,
  setResume,
  patchResume,
  // ============
  resumePage,
  getResumeByHash,
  // ============
  downloadResume,
  getShareRecords,
  // ============
  getResumeInfo,
  setResumeInfo,
};

/* eslint eqeqeq: "off", guard-for-in: "off" */

import getCacheKey from './helper/cacheKey';
import Downloads from '../services/downloads';
import dateHelper from '../utils/date';
import logger from '../utils/logger';
import notify from '../services/notify';
import {
  formatObject
} from '../utils/helper';
import UserAPI from '../services/user';
import StatAPI from '../services/stat';

/* ===================== private ===================== */

const getResumeShareStatus = (resumeInfo, locale) => {
  const {
    login,
    github,
    reminder,
    template,
    useGithub,
    resumeHash,
    openShare,
    simplifyUrl,
  } = resumeInfo;

  return {
    login,
    github,
    locale,
    template,
    reminder,
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
  const data = await UserAPI.getResume({ userId });

  ctx.body = {
    success: true,
    result: data ? data.resume : null,
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

  if (result.newResume) {
    await StatAPI.putStat({
      type: 'resume',
      action: 'count'
    });
  }

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
  const getResult = await UserAPI.getResume({ userId });
  const resume = Object.assign({}, getResult ? getResult.resume : {});
  const { data } = ctx.request.body;

  for (const key in data) {
    const d = data[key];
    for (const k in d) {
      if (!resume[key]) resume[key] = {};
      resume[key][k] = d[k];
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

  const [
    result,
    findResult
  ] = await Promise.all([
    UserAPI.getResumeInfo({ userId }),
    UserAPI.getResume({ userId })
  ]);
  const { template, resumeHash } = result;

  if (!findResult) {
    return ctx.body = {
      result: '',
      success: true,
      message: ctx.__('messages.error.emptyResume'),
    };
  }

  const updateTime = findResult.update_at || findResult.updated_at;
  const seconds = dateHelper.getSeconds(updateTime);

  const resumeUrl =
    `${ctx.request.origin}/resume/${resumeHash}?locale=${locale}&userId=${userId}&notrace=true`;

  notify('slack').send({
    mq: ctx.mq,
    data: {
      type: 'download',
      data: `【${githubLogin}:${resumeHash}】`
    }
  });

  logger.info(`[RESUME:DOWNLOAD][${resumeUrl}]`);

  await StatAPI.putStat({
    type: 'resume',
    action: 'download'
  });

  let resultUrl = '';
  try {
    resultUrl = await Downloads.resume(resumeUrl, {
      folder: githubLogin,
      title: `${template}-${locale}-${seconds}-resume.pdf`
    });
    logger.info(`[RESUME:RENDERED][${resultUrl}]`);
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
  const findResult = await UserAPI.getResume({ hash });

  let result = null;
  if (findResult) {
    result = findResult.resume;
    result.updateAt = findResult.updated_at;
  }

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

const getShareRecords = async (ctx) => {
  const { userId, githubLogin } = ctx.session;

  const resumeInfo = await UserAPI.getResumeInfo({ userId });
  if (!resumeInfo) {
    return ctx.body = {
      success: true,
      result: {
        url: '',
        viewDevices: [],
        viewSources: [],
        pageViews: [],
        openShare: false
      }
    };
  }

  const records = await StatAPI.getRecords({
    login: githubLogin,
    type: 'resume'
  });

  const viewDevices = [];
  const viewSources = [];
  const pageViews = [];

  for (const record of records) {
    viewDevices.push(...record.viewDevices);
    viewSources.push(...record.viewSources);
    pageViews.push(...record.pageViews);
  }
  ctx.body = {
    success: true,
    result: {
      pageViews,
      viewDevices,
      viewSources,
      openShare: resumeInfo.openShare,
      url: `${githubLogin}/resume?locale=${ctx.session.locale}`,
    }
  };
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

const setResumeReminder = async (ctx) => {
  const { reminder } = ctx.request.body;
  const { userId, githubLogin } = ctx.session;

  const result = await UserAPI.patchResumeReminder({
    reminder,
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
  setResumeReminder
};

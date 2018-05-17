/* eslint eqeqeq: "off" */
import Api from '../services/api';
import {
  combineReposCommits,
  UPDATE_STATUS_TEXT
} from './helper/github';
import { is, sortBy } from '../utils/helper';
import UserAPI from '../services/user';
import StatAPI from '../services/stat';

/* ================== private func ==================== */

const _getUser = async (ctx) => {
  const { login } = ctx.params;
  const user = await Api.getUser(login);
  if (!user) {
    return ctx.redirect('/404');
  }
  return user;
};

const _getRepositories = async (login, token) => {
  const repositories = await Api.getUserRepositories(login, token);
  repositories.sort(sortBy.star);
  return repositories;
};

const _getContributed = async (login, token) => {
  const repos = await Api.getUserContributed(login, token);
  repos.sort(sortBy.star);
  return repos;
};

const _getCommits = async (login, token) => {
  const commits = await Api.getUserCommits(login, token);
  const formatCommits = combineReposCommits(commits);
  commits.sort(sortBy.x('totalCommits', parseInt));

  return {
    commits,
    formatCommits,
  };
};

/* ================== router handler ================== */

const toggleShare = async (ctx) => {
  const { userId } = ctx.session;
  const { enable } = ctx.request.body;

  await UserAPI.updateUser(userId, { githubShare: Boolean(enable) });
  const message = Boolean(enable) == true
    ? 'messages.share.toggleOpen'
    : 'messages.share.toggleClose'
  ctx.body = {
    success: true,
    message: ctx.__(message)
  };
};

const getAllRepositories = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session;
  const repos = await Api.getUserRepositories(githubLogin, githubToken);
  const result = repos.filter(repository => !repository.fork)
    .map((repository) => {
      const {
        name,
        language,
        stargazers_count
      } = repository;
      return {
        name,
        language,
        stargazers_count,
      };
    });

  ctx.body = {
    result,
    success: true,
  };

  await next();
};

const getUserContributed = async (ctx, next) => {
  const repositories =
    await _getContributed(ctx.params.login, ctx.session.githubToken);
  ctx.body = {
    success: true,
    result: {
      repositories,
    }
  };
  await next();
};

const getUserRepositories = async (ctx, next) => {
  const repositories =
    await _getRepositories(ctx.params.login, ctx.session.githubToken);
  ctx.body = {
    success: true,
    result: {
      repositories,
    },
  };
  await next();
};

const getUserCommits = async (ctx, next) => {
  const {
    commits,
    formatCommits
  } = await _getCommits(ctx.params.login, ctx.session.githubToken);

  if (!commits.length) {
    ctx.query.shouldCache = false;
  }

  ctx.body = {
    success: true,
    result: {
      commits,
      formatCommits
    }
  };
  await next();
};

const getUserOrganizations = async (ctx, next) => {
  const { login } = ctx.params;
  const { githubToken } = ctx.session;
  const organizations =
    await Api.getUserOrganizations(login, githubToken);

  ctx.body = {
    success: true,
    result: { organizations }
  };
  await next();
};

const getUser = async (ctx, next) => {
  const { login } = ctx.params;
  const user = await _getUser(ctx);
  const userInfo = await UserAPI.getUser({ login });

  const result = Object.assign({}, user);
  result.openShare = userInfo.githubShare;
  result.shareUrl = `${login}/github?locale=${ctx.session.locale}`;
  ctx.body = {
    success: true,
    result
  };
  await next();
};

const githubPage = async (ctx) => {
  const { login } = ctx.params;
  const { isMobile, locale } = ctx.state;
  const { githubLogin } = ctx.session;
  const title = ctx.__('sharePage.title', login);
  const options = {
    title,
    user: {
      login,
      isAdmin: login === githubLogin,
    },
    locale,
    shareText: isMobile
      ? ctx.__('messages.share.mobileText')
      : ctx.__('messages.share.text')
  };
  if (isMobile) {
    await ctx.render('user/mobile/github', options);
  } else {
    await ctx.render('github/share', options);
  }
};

const getShareRecords = async (ctx) => {
  const { githubLogin, locale } = ctx.session;

  const records = await StatAPI.getRecords({
    login: githubLogin,
    type: 'github'
  });
  const userInfo = await UserAPI.getUser({ login: githubLogin });

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
      locale,
      pageViews,
      viewDevices,
      viewSources,
      openShare: userInfo.githubShare,
      url: `${githubLogin}/github?locale=${locale}`,
    }
  };
};

const refreshEnable = status => status !== 2 && status !== 3;

const getUpdateStatus = async (ctx) => {
  const { githubLogin, userId } = ctx.session;
  const statusResult = await Api.getUpdateStatus(githubLogin);
  const {
    status,
    lastUpdateTime,
  } = statusResult;

  const statusCode = parseInt(status, 10);
  if (statusCode === 1) {
    await UserAPI.updateUser(userId, { initialed: true });
  }
  const messageKey = UPDATE_STATUS_TEXT[statusCode];

  const result = {
    status,
    lastUpdateTime,
    refreshEnable: refreshEnable(statusCode)
      && (new Date() - new Date(lastUpdateTime)) / (60 * 1000) > 10,
  };
  ctx.body = {
    result,
    success: true,
    message: messageKey ? ctx.__(messageKey) : '',
  };
};

const updateUserData = async (ctx) => {
  const { githubToken, githubLogin } = ctx.session;
  await Api.updateUserData(githubLogin, githubToken);
  ctx.body = {
    message: ctx.__('messages.update.pending'),
    success: true,
  };
};

const getZen = async (ctx) => {
  const { githubToken } = ctx.session;
  const val = await Api.getZen(githubToken);
  const result = is.object(val) ? '' : val;
  ctx.body = {
    result,
    success: true,
  };
};

const getOctocat = async (ctx) => {
  const result = await Api.getOctocat();
  ctx.body = {
    result,
    success: true,
  };
};

const getUserHotmap = async (ctx, next) => {
  const { login } = ctx.params;
  const { locale } = ctx.session;
  const result = await Api.getHotmap(login, locale);
  ctx.body = {
    result,
    success: true,
  };
  await next();
};

export default {
  githubPage,
  getAllRepositories,
  // github info
  getUser,
  toggleShare,
  getShareRecords,
  getUserHotmap,
  getUserCommits,
  getUserContributed,
  getUserRepositories,
  getUserOrganizations,
  /* ===== refresh & update ====== */
  getUpdateStatus,
  updateUserData,
  /* ========== */
  getZen,
  getOctocat,
};

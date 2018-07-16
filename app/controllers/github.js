/* eslint eqeqeq: "off" */
import config from 'config';
import GitHubAPI from '../services/github';
import { combineReposCommits } from './helper/github';
import { UPDATE_STATUS_TEXT } from '../utils/constant';
import { is, sortBy } from '../utils/helper';
import UserAPI from '../services/user';
import StatAPI from '../services/stat';
import logger from '../utils/logger';

const services = config.get('services.github');

/* ================== private func ==================== */

const _getUser = async (ctx) => {
  const { login } = ctx.params;
  const user = await GitHubAPI.getUser(login);
  if (!user) {
    return ctx.redirect('/404');
  }
  return user;
};

const _getRepositories = async (login, token) => {
  const repositories = await GitHubAPI.getUserRepositories(login, token);
  repositories.sort(sortBy.star);
  return repositories;
};

const _getContributed = async (login, token) => {
  const repos = await GitHubAPI.getUserContributed(login, token);
  repos.sort(sortBy.star);
  return repos;
};

const _getCommits = async (login, token) => {
  const commits = await GitHubAPI.getUserCommits(login, token);
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
  const repos = await GitHubAPI.getUserRepositories(githubLogin, githubToken);
  const result = [];

  for (const repository of repos) {
    if (!repository.fork) {
      const {
        name,
        language,
        stargazers_count
      } = repository;
      result.push({
        name,
        language,
        stargazers_count
      });
    }
  }

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
    result: repositories
  };
  await next();
};

const getUserRepositories = async (ctx, next) => {
  const repositories =
    await _getRepositories(ctx.params.login, ctx.session.githubToken);
  ctx.body = {
    success: true,
    result: repositories,
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

const getUserLanguages = async (ctx, next) => {
  const { login } = ctx.params;
  const { githubToken } = ctx.session;

  const languages = await GitHubAPI.getUserLanguages(login, githubToken);
  ctx.body = {
    success: true,
    result: languages
  };
  await next();
};

const getUserOrganizations = async (ctx, next) => {
  const { login } = ctx.params;
  const { githubToken } = ctx.session;
  const organizations =
    await GitHubAPI.getUserOrganizations(login, githubToken);

  ctx.body = {
    success: true,
    result: organizations
  };
  await next();
};

const getUser = async (ctx, next) => {
  const { login } = ctx.params;
  const [user, userInfo] = await Promise.all([
    _getUser(ctx),
    UserAPI.getUser({ login })
  ]);

  const result = Object.assign({}, user);
  result.openShare = userInfo.githubShare;
  result.shareUrl = `${login}/github?locale=${ctx.session.locale}`;
  ctx.body = {
    result,
    success: true,
  };
  await next();
};

const githubPage = async (ctx) => {
  const { login } = ctx.params;
  const { locale, template, isMobile } = ctx.state;
  const { githubLogin } = ctx.session;
  const title = ctx.__('sharePage.title', login);
  const options = {
    title,
    locale,
    user: {
      login,
      isAdmin: login === githubLogin,
    },
    shareText: isMobile
      ? ctx.__('messages.share.mobileText')
      : ctx.__('messages.share.text')
  };
  await ctx.render(`github/${template}`, options);
};

const getShareRecords = async (ctx) => {
  const { githubLogin, locale } = ctx.session;

  let records = [];
  try {
    records = await StatAPI.getRecords({
      login: githubLogin,
      type: 'github'
    });
  } catch (e) {
    logger.error(e);
  }

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

const updateFinished = status => status !== 2 && status !== 3;

const refreshEnable = (status, lastUpdate) =>
  updateFinished(status) && new Date() - new Date(lastUpdate) > services.refreshInterval;

const getUpdateStatus = async (ctx) => {
  const { githubLogin, userId } = ctx.session;
  const statusResult = await GitHubAPI.getUpdateStatus(githubLogin);
  logger.info(`${githubLogin} update status: ${JSON.stringify(statusResult)}`);
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
    finished: updateFinished(statusCode),
    refreshEnable: refreshEnable(statusCode, lastUpdateTime),
  };
  ctx.body = {
    result,
    success: true,
    message: messageKey ? ctx.__(messageKey) : '',
  };
};

const updateUserData = async (ctx) => {
  const { githubToken, githubLogin } = ctx.session;
  await GitHubAPI.updateUserData(githubLogin, githubToken);

  ctx.body = {
    success: true,
    message: ctx.__('messages.update.pending'),
  };
};

const getZen = async (ctx) => {
  const { githubToken } = ctx.session;
  const val = await GitHubAPI.getZen(githubToken);
  const result = is.object(val) ? '' : val;

  ctx.body = {
    result,
    success: true,
  };
};

const getOctocat = async (ctx) => {
  const result = await GitHubAPI.getOctocat();
  ctx.body = {
    result,
    success: true,
  };
};

const getUserHotmap = async (ctx, next) => {
  const { login } = ctx.params;
  const { locale } = ctx.session;
  const result = await GitHubAPI.getHotmap(login, locale);

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
  getUserHotmap,
  getUserCommits,
  getShareRecords,
  getUserLanguages,
  getUserContributed,
  getUserRepositories,
  getUserOrganizations,
  /* ===== refresh & update ====== */
  updateUserData,
  getUpdateStatus,
  /* ========== */
  getZen,
  getOctocat,
};

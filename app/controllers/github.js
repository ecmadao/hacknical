/* eslint eqeqeq: "off" */
import Api from '../services/api';
import ShareAnalyse from '../models/share-analyse';
import getCacheKey from './helper/cacheKey';
import {
  combineReposCommits
} from './helper/github';
import { is, sortBy } from '../utils/helper';

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
  const { enable } = ctx.request.body;
  await ShareAnalyse.changeShareStatus({
    enable,
    url: new RegExp('github')
  });
  const message = Boolean(enable) == true
    ? 'messages.share.toggleOpen'
    : 'messages.share.toggleClose'
  ctx.body = {
    success: true,
    message: ctx.__(message)
  };
};

const fetchHotmap = async (ctx) => {
  const { githubLogin, locale } = ctx.session;
  await Api.getHotmap(githubLogin, locale);
  ctx.body = {
    success: true,
    result: 'Fetch hotmap success'
  };
};

const fetchRepositories = async (ctx) => {
  const { githubLogin, githubToken } = ctx.session;
  await Api.getUserRepositories(githubLogin, githubToken);
  ctx.body = {
    success: true,
    result: 'Fetch repositories success'
  };
};

const fetchCommits = async (ctx) => {
  const { githubLogin, githubToken } = ctx.session;
  await Api.getUserCommits(githubLogin, githubToken);
  ctx.body = {
    success: true,
    result: 'Fetch commits success'
  };
};

const fetchOrganizations = async (ctx) => {
  const { githubLogin, githubToken } = ctx.session;
  await Api.getUserOrganizations(githubLogin, githubToken);
  ctx.body = {
    success: true,
    result: 'Fetch orgs success'
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
  const shareAnalyse =
    await ShareAnalyse.findOne({ login, url: new RegExp('github') });

  const result = Object.assign({}, user);
  result.openShare = shareAnalyse.enable;
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
  const { githubLogin } = ctx.session;
  const shareAnalyses =
    await ShareAnalyse.find({ login: githubLogin, url: new RegExp('github') });

  const viewDevices = [];
  const viewSources = [];
  const pageViews = [];
  for (let i = 0; i < shareAnalyses.length; i += 1) {
    const shareAnalyse = shareAnalyses[i];
    viewDevices.push(...shareAnalyse.viewDevices);
    viewSources.push(...shareAnalyse.viewSources);
    pageViews.push(...shareAnalyse.pageViews);
  }
  ctx.body = {
    success: true,
    result: {
      pageViews,
      viewDevices,
      viewSources,
      openShare: shareAnalyses[0] ? shareAnalyses[0].enable : false,
      url: `${githubLogin}/github?locale=${ctx.session.locale}`,
    }
  };
};

const getUpdateTime = async (ctx) => {
  const { githubLogin } = ctx.session;
  const result = await Api.getUpdateTime(githubLogin);
  ctx.body = {
    result,
    success: true,
  };
};

const refreshRepositories = async (ctx, next) => {
  const { githubToken, githubLogin } = ctx.session;
  await Api.refreshUser(githubLogin, githubToken);
  await Api.refreshHotmap(githubLogin, githubToken);
  const result = await Api.refreshRepositories(githubLogin, githubToken);
  if (result.success === false) {
    const error = result.error || ctx.__('messages.error.frequent').replace(/%s/, result.result);
    ctx.body = {
      error,
      result: null,
      success: true,
    };
    return;
  }

  await Api.refreshContributed(githubLogin, githubToken);

  // set cache keys to remove
  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey('user-repositories', {
      session: ['githubLogin']
    }),
    cacheKey('user-contributed', {
      session: ['githubLogin']
    }),
    cacheKey('allRepositories', {
      session: ['githubLogin']
    }),
    cacheKey('user-github', {
      session: ['githubLogin']
    }),
    cacheKey('user-hotmap', {
      session: ['githubLogin', 'locale']
    }),
  ];

  ctx.body = {
    result,
    success: true,
    message: ctx.__('messages.success.updateRepos'),
  };

  await next();
};

const refreshCommits = async (ctx, next) => {
  const { githubToken, githubLogin } = ctx.session;
  const result = await Api.refreshCommits(githubLogin, githubToken);

  if (result.success === false) {
    const error = result.error || ctx.__('messages.error.frequent').replace(/%s/, result.result);
    ctx.body = {
      error,
      result: null,
      success: true,
    };
    return;
  }

  // set cache keys to remove
  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey('user-commits', {
      session: ['githubLogin']
    })
  ];

  ctx.body = {
    result,
    success: true,
    message: ctx.__('messages.success.updateCommits'),
  };

  await next();
};

const refreshOrganizations = async (ctx, next) => {
  const { githubToken, githubLogin } = ctx.session;
  const result = await Api.refreshOrganizations(githubLogin, githubToken);

  if (result.success === false) {
    const error = result.error || ctx.__('messages.error.frequent').replace(/%s/, result.result);
    ctx.body = {
      error,
      result: null,
      success: true,
    };
    return;
  }

  // set cache keys to remove
  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey('user-organizations', {
      session: ['githubLogin']
    })
  ];

  ctx.body = {
    result,
    success: true,
    message: ctx.__('messages.success.updateOrgs'),
  };

  await next();
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
  fetchHotmap,
  fetchCommits,
  fetchRepositories,
  fetchOrganizations,
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
  getUpdateTime,
  refreshCommits,
  refreshRepositories,
  refreshOrganizations,
  /* ========== */
  getZen,
  getOctocat,
};

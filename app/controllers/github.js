/* eslint eqeqeq: "off" */
import User from '../models/users';
import Api from '../services/api';
import ShareAnalyse from '../models/share-analyse';
import getCacheKey from './helper/cacheKey';
import { getMobileMenu } from './shared';
import {
  getReposLanguages,
  combineReposCommits
} from './helper/github';

/* ================== private func ====================*/

const _getUser = async (ctx) => {
  const { login } = ctx.params;
  const user = await Api.getUser(login);
  if (!user) {
    return ctx.redirect('/404');
  }
  return user;
};

const _getRepos = async (login, token) => {
  const repos = await Api.getUserRepos(login, token);
  const pinned = await User.findPinnedRepos(login);
  const checkPinned = repository =>
    pinned.some(item => item === repository.reposId);
  const pinnedRepos = pinned.length
    ? repos.filter(repository => checkPinned(repository) || repository.fork)
    : repos;

  const reposLanguages = getReposLanguages(pinnedRepos);
  return {
    repos: pinnedRepos,
    reposLanguages,
  };
};

const _getContributed = async (login, token) => {
  const repos = await Api.getUserContributed(login, token);
  return repos;
};

const _getCommits = async (login, token) => {
  const commits = await Api.getUserCommits(login, token);
  const formatCommits = combineReposCommits(commits);
  return {
    commits,
    formatCommits,
  };
};

const _getOrgs = async (login, token) => {
  const orgs = await Api.getUserOrgs(login, token);
  return orgs;
};

/* ================== router handler ================== */

const toggleShare = async (ctx) => {
  const { githubLogin } = ctx.session;
  const { enable } = ctx.request.body;
  await ShareAnalyse.changeShareStatus({
    enable,
    url: `github/${githubLogin}`
  });
  const message = Boolean(enable) == true
    ? 'messages.share.toggleOpen'
    : 'messages.share.toggleClose'
  ctx.body = {
    success: true,
    message: ctx.__(message)
  };
};

const getUser = async (ctx) => {
  const { githubLogin, githubToken } = ctx.session;
  const user = await Api.getUser(githubLogin, githubToken);
  const login = user.login;
  const shareAnalyse =
    await ShareAnalyse.findShare({ login, url: `github/${login}` });

  const result = Object.assign({}, user);
  result.openShare = shareAnalyse.enable;
  result.shareUrl = `github/${login}?locale=${ctx.session.locale}`;
  ctx.body = {
    result,
    success: true,
  };
};

const fetchRepos = async (ctx) => {
  const { githubLogin, githubToken } = ctx.session;
  await Api.getUserRepos(githubLogin, githubToken);
  ctx.body = {
    success: true,
    result: 'fetch repos success'
  };
};

const fetchCommits = async (ctx) => {
  const { githubLogin, githubToken } = ctx.session;
  await Api.getUserCommits(githubLogin, githubToken);
  ctx.body = {
    success: true,
    result: 'fetch commits success'
  };
};

const fetchOrgs = async (ctx) => {
  const { githubLogin, githubToken } = ctx.session;
  await Api.getUserOrgs(githubLogin, githubToken);
  ctx.body = {
    success: true,
    result: 'fetch orgs success'
  };
};

const getAllRepos = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session;
  const repos = await Api.getUserRepos(githubLogin, githubToken);
  const result = repos.filter(repository => !repository.fork)
    .map((repository) => {
      const { reposId, name, language, stargazers_count } = repository;
      return {
        name,
        reposId,
        language,
        stargazers_count
      };
    });

  ctx.body = {
    result,
    success: true,
  };

  await next();
};

const getSharedContributed = async (ctx, next) => {
  const repos =
    await _getContributed(ctx.params.login, ctx.session.githubToken);
  ctx.body = {
    success: true,
    result: {
      repos,
    }
  };
  await next();
};

const getUserContributed = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session;
  const repos = await _getContributed(githubLogin, githubToken);
  ctx.body = {
    success: true,
    result: {
      repos,
    }
  };
  await next();
};

const getSharedRepos = async (ctx, next) => {
  const {
    repos,
    reposLanguages,
  } = await _getRepos(ctx.params.login, ctx.session.githubToken);
  ctx.body = {
    success: true,
    result: {
      repos,
      reposLanguages,
    }
  };
  await next();
};

const getUserRepos = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session;
  const {
    repos,
    reposLanguages,
  } = await _getRepos(githubLogin, githubToken);
  ctx.body = {
    success: true,
    result: {
      repos,
      reposLanguages,
    }
  };
  await next();
};

const getSharedCommits = async (ctx, next) => {
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

const getUserCommits = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session;
  const {
    commits,
    formatCommits,
  } = await _getCommits(githubLogin, githubToken);

  if (!commits.length) {
    ctx.query.shouldCache = false;
  }

  ctx.body = {
    success: true,
    result: {
      commits,
      formatCommits,
    }
  };
  await next();
};

const getSharedOrgs = async (ctx, next) => {
  const orgs = await _getOrgs(ctx.params.login, ctx.session.githubToken);
  ctx.body = {
    success: true,
    result: { orgs }
  };
  await next();
};

const getUserOrgs = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session;
  const orgs = await _getOrgs(githubLogin, githubToken);
  ctx.body = {
    success: true,
    result: { orgs }
  };
  await next();
};

const getSharedUser = async (ctx, next) => {
  const user = await _getUser(ctx);
  ctx.body = {
    success: true,
    result: user
  };
  await next();
};

const sharePageMobile = async (ctx) => {
  const { login } = ctx.params;
  const user = await _getUser(ctx);
  const { githubLogin } = ctx.session;
  const title = ctx.__('sharePage.github', user.name || user.login);

  const {
    bio,
    name,
    followers,
    following,
    avatar_url,
    created_at,
    public_repos,
  } = user;

  await ctx.render('user/mobile/github', {
    title,
    user: {
      bio,
      login,
      followers,
      following,
      avatar_url,
      public_repos,
      name: name || login,
      isAdmin: login === githubLogin,
      created_at: created_at.split('T')[0]
    },
    shareText: ctx.__('messages.share.mobileText'),
    joinAt: ctx.__('sharePage.joinAt'),
    menu: getMobileMenu(ctx)
  });
};

const sharePage = async (ctx) => {
  const { login } = ctx.params;
  const user = await _getUser(ctx);
  const { githubLogin } = ctx.session;
  const title = ctx.__('sharePage.github', user.name || user.login);

  await ctx.render('github/share', {
    title,
    user: {
      login,
      isAdmin: login === githubLogin
    },
    shareText: ctx.__('messages.share.text')
  });
};

const getStareRecords = async (ctx) => {
  const { githubLogin } = ctx.session;
  const url = `github/${githubLogin}`;
  const shareAnalyse =
    await ShareAnalyse.findShare({ login: githubLogin, url });
  const { viewDevices, viewSources, pageViews, enable } = shareAnalyse;
  ctx.body = {
    success: true,
    result: {
      pageViews,
      viewDevices,
      viewSources,
      openShare: enable,
      url: `${url}?locale=${ctx.session.locale}`,
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

const refreshRepos = async (ctx, next) => {
  const { githubToken, githubLogin } = ctx.session;
  const result = await Api.refreshUserRepos(githubLogin, githubToken);

  if (!result.success) {
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
    cacheKey('formattedRepos', {
      session: ['githubLogin']
    }),
    cacheKey('allRepos', {
      session: ['githubLogin']
    }),
    cacheKey(`sharedUser.${githubLogin}`)
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
  const result = await Api.refreshUserCommits(githubLogin, githubToken);

  if (!result.success) {
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
    cacheKey('formattedCommits', {
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

const refreshOrgs = async (ctx, next) => {
  const { githubToken, githubLogin } = ctx.session;
  const result = await Api.refreshUserOrgs(githubLogin, githubToken);

  if (!result.success) {
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
    cacheKey('orgs', {
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
  const result = await Api.getZen();
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

export default {
  getUser,
  getSharedUser,
  sharePage,
  sharePageMobile,
  fetchRepos,
  fetchCommits,
  fetchOrgs,
  getAllRepos,
  getUserRepos,
  getUserCommits,
  getUserContributed,
  getUserOrgs,
  getSharedRepos,
  getSharedContributed,
  getSharedCommits,
  getSharedOrgs,
  toggleShare,
  getStareRecords,
  /* ===== refresh & update ====== */
  getUpdateTime,
  refreshRepos,
  refreshOrgs,
  refreshCommits,
  /* ========== */
  getZen,
  getOctocat
};

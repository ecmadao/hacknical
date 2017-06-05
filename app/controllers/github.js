import User from '../models/users';
import Api from '../services/api';
import ShareAnalyse from '../models/share-analyse';
import getCacheKey from './helper/cacheKey';
import { getMobileMenu } from './shared';

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
  const { repos } = await Api.getUserRepos(login, token);
  const pinned = await User.findPinnedRepos(login);
  const checkPinned = (repository) => pinned.some(item => item === repository.reposId);
  const pinnedRepos = pinned.length
    ? repos.filter(repository => checkPinned(repository) || repository.fork)
    : repos;

  return pinnedRepos;
};

const _getCommits = async (login, token) => {
  const { commits } = await Api.getUserCommits(login, token);
  return commits;
};

const _getOrgs = async (login, token) => {
  const orgs = await Api.getUserOrgs(login, token);
  return orgs;
};

/* ================== router handler ================== */

const toggleShare = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  const { enable } = ctx.request.body;
  await ShareAnalyse.changeShareStatus({
    enable,
    url: `github/${githubLogin}`
  });
  const message = Boolean(enable) == true ? "messages.share.toggleOpen" : "messages.share.toggleClose"
  ctx.body = {
    success: true,
    message: ctx.__(message)
  };
};

const getUser = async (ctx, next) => {
  const { githubLogin, githubToken, userId } = ctx.session;
  const user = await Api.getUser(githubLogin, githubToken);
  const login = user.login;
  const shareAnalyse = await ShareAnalyse.findShare({ login, url: `github/${login}` });

  const result = Object.assign({}, user);
  result.openShare = shareAnalyse.enable;
  result.shareUrl = `github/${login}?locale=${ctx.session.locale}`;
  return ctx.body = {
    success: true,
    result
  };
};

const fetchRepos = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session;
  await Api.getUserRepos(githubLogin, githubToken);
  ctx.body = {
    success: true,
    result: 'fetch repos success'
  };
};

const fetchCommits = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session;
  await Api.getUserCommits(githubLogin, githubToken);
  ctx.body = {
    success: true,
    result: 'fetch commits success'
  };
};

const fetchOrgs = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session;
  await Api.getUserOrgs(githubLogin, githubToken);
  ctx.body = {
    success: true,
    result: 'fetch orgs success'
  };
};

const getAllRepos = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session;
  const { repos } = await Api.getUserRepos(githubLogin, githubToken);
  const result = repos.filter(repository => !repository.fork).map((repository) => {
    const { reposId, name, language, stargazers_count } = repository;
    return {
      name,
      reposId,
      language,
      stargazers_count
    }
  });

  ctx.body = {
    success: true,
    result
  };

  await next();
};

const getSharedRepos = async (ctx, next) => {
  const repos = await _getRepos(ctx.params.login, ctx.session.githubToken);
  ctx.body = {
    success: true,
    result: { repos }
  };
  await next();
};

const getUserRepos = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session;
  const repos = await _getRepos(githubLogin, githubToken);
  ctx.body = {
    success: true,
    result: { repos }
  };
  await next();
};

const getSharedCommits = async (ctx, next) => {
  const commits = await _getCommits(ctx.params.login, ctx.session.githubToken);
  ctx.body = {
    success: true,
    result: { commits }
  };
  await next();
};

const getUserCommits = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session;
  const commits = await _getCommits(githubLogin, githubToken);

  if (!commits.length) {
    ctx.query.shouldCache = false;
  }
  ctx.body = {
    success: true,
    result: { commits }
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

const sharePageMobile = async (ctx, next) => {
  const { login } = ctx.params;
  const user = await _getUser(ctx);
  const { githubLogin } = ctx.session;
  const title = ctx.__("sharePage.github", user.name || user.login);

  const {
    bio,
    name,
    created_at,
    avatar_url,
    public_repos,
    followers,
    following
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
    shareText: ctx.__("messages.share.mobileText"),
    joinAt: ctx.__("sharePage.joinAt"),
    menu: getMobileMenu(ctx)
  });
};

const sharePage = async (ctx, next) => {
  const { login } = ctx.params;
  const user = await _getUser(ctx);
  const { githubLogin } = ctx.session;
  const title = ctx.__("sharePage.github", user.name || user.login);

  await ctx.render('github/share', {
    title,
    user: {
      login,
      isAdmin: login === githubLogin
    },
    shareText: ctx.__("messages.share.text")
  });
};

const getStareRecords = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  const url = `github/${githubLogin}`;
  const shareAnalyse = await ShareAnalyse.findShare({ login: githubLogin, url });
  const { viewDevices, viewSources, pageViews, enable } = shareAnalyse;
  ctx.body = {
    success: true,
    result: {
      url: `${url}?locale=${ctx.session.locale}`,
      viewDevices,
      viewSources,
      pageViews,
      openShare: enable
    }
  };
};

const getUpdateTime = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  const result = await Api.getUpdateTime(githubLogin);
  return ctx.body = {
    success: true,
    result
  };
};

const refreshRepos = async (ctx, next) => {
  const { githubToken, githubLogin } = ctx.session;
  const result = await Api.refreshUserRepos(githubLogin, githubToken);
  if (result === false) {
    return ctx.body = {
      success: true,
      error: ctx.__("messages.error.frequent"),
      result: null
    };
  }

  // set cache keys to remove
  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey('repos', {
      session: ['githubLogin']
    }),
    cacheKey('allRepos', {
      session: ['githubLogin']
    }),
    cacheKey(`sharedUser.${githubLogin}`)
  ];

  ctx.body = {
    success: true,
    message: ctx.__("messages.success.updateRepos"),
    result
  };

  await next();
};

const refreshCommits = async (ctx, next) => {
  const { githubToken, githubLogin } = ctx.session;
  const result = await Api.refreshUserCommits(githubLogin, githubToken);

  if (result === false) {
    return ctx.body = {
      success: true,
      error: ctx.__("messages.error.frequent"),
      result: null
    };
  }

  // set cache keys to remove
  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey('commits', {
      session: ['githubLogin']
    })
  ];

  ctx.body = {
    success: true,
    message: ctx.__("messages.success.updateCommits"),
    result
  };

  await next();
};

const refreshOrgs = async (ctx, next) => {
  const { githubToken, githubLogin } = ctx.session;
  const result = await Api.refreshUserOrgs(githubLogin, githubToken);
  if (result === false) {
    return ctx.body = {
      success: true,
      error: ctx.__("messages.error.frequent"),
      result: null
    };
  }

  // set cache keys to remove
  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey('orgs', {
      session: ['githubLogin']
    })
  ];

  ctx.body = {
    success: true,
    message: ctx.__("messages.success.updateOrgs"),
    result
  };

  await next();
};

const getZen = async (ctx) => {
  const result = await Api.getZen();
  ctx.body = {
    success: true,
    result
  }
};

const getOctocat = async (ctx) => {
  const result = await Api.getOctocat();
  ctx.body = {
    success: true,
    result
  }
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
  getUserOrgs,
  getSharedRepos,
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

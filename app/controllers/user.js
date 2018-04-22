
import Api from '../services/api';
import getCacheKey from './helper/cacheKey';
import { getGithubSections } from './shared';
import logger from '../utils/logger';
import UserAPI from '../services/user';
import notify from '../services/notify';

const clearCache = async (ctx, next) => {
  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey('user-repositories', {
      query: ['login']
    }),
    cacheKey('user-contributed', {
      query: ['login']
    }),
    cacheKey('allRepositories', {
      query: ['login']
    }),
    cacheKey('user-github', {
      query: ['login']
    }),
    cacheKey('user-hotmap', {
      query: ['login'],
      session: ['locale']
    }),
    cacheKey('user-organizations', {
      query: ['login'],
    }),
    cacheKey('user-commits', {
      query: ['login'],
    })
  ];
  ctx.body = {
    success: true
  };
  await next();
};

const logout = async (ctx) => {
  ctx.session.userId = null;
  ctx.session.githubToken = null;
  ctx.session.githubLogin = null;
  ctx.redirect('/');
};

const loginByGitHub = async (ctx) => {
  const { code } = ctx.request.query;
  try {
    const githubToken = await Api.getToken(code);
    const userInfo = await Api.getLogin(githubToken);
    logger.debug(userInfo);

    if (userInfo.login) {
      ctx.session.githubToken = githubToken;
      ctx.session.githubLogin = userInfo.login;

      const user = await UserAPI.createUser(userInfo);
      notify('slack').send({
        mq: ctx.mq,
        data: {
          type: 'login',
          data: `<https://github.com/${userInfo.login}|${userInfo.login}> logined!`
        }
      });

      logger.info(`[USER:LOGIN] ${JSON.stringify(user)}`);
      ctx.session.userId = user.userId;
      if (user && user.initialed) Api.updateUserData(ctx.session.githubLogin, githubToken);
      return ctx.redirect(`/${ctx.session.githubLogin}`);
    }
    return ctx.redirect('/user/logout');
  } catch (err) {
    logger.error(err);
    return ctx.redirect('/user/logout');
  }
};

const initialFinished = async (ctx) => {
  const { userId } = ctx.session;

  await UserAPI.updateUser(userId, { initialed: true });
  ctx.cache.hincrby('github', 'count', 1);

  ctx.body = {
    success: true,
    result: ''
  };
};

const getGithubShareSections = async (ctx) => {
  const { login } = ctx.query;
  const user = await UserAPI.getUser({
    login: login || ctx.session.githubLogin
  });

  ctx.body = {
    success: true,
    result: user.githubSections
  };
};

const setGithubShareSections = async (ctx) => {
  const { userId } = ctx.session;
  const githubSections = getGithubSections(ctx.request.body);

  await UserAPI.updateUser(userId, { githubSections });
  ctx.body = {
    success: true
  };
};

const getPinnedRepos = async (ctx) => {
  const { login } = ctx.query;
  const user = await UserAPI.getUser({
    login: login || ctx.session.githubLogin
  });
  ctx.body = {
    success: true,
    result: user.pinnedRepos
  }
};

const setPinnedRepos = async (ctx, next) => {
  const { userId, githubLogin } = ctx.session;
  const { pinnedRepos } = ctx.request.body;
  const repos = pinnedRepos.split(',');

  await UserAPI.updateUser(userId, { pinnedRepos: repos });

  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey('repos', {
      session: ['githubLogin']
    }),
    cacheKey('commits', {
      session: ['githubLogin']
    }),
    cacheKey(`sharedUser.${githubLogin}`)
  ];

  ctx.body = {
    success: true
  };

  await next();
};

export default {
  // user
  logout,
  loginByGitHub,
  initialFinished,
  getPinnedRepos,
  setPinnedRepos,
  clearCache,
  // github sections
  getGithubShareSections,
  setGithubShareSections,
};

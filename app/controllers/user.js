
import Api from '../services/api';
import getCacheKey from './helper/cacheKey';
import logger from '../utils/logger';
import UserAPI from '../services/user';
import notify from '../services/notify';
import StatAPI from '../services/stat';

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
  await StatAPI.putStat({
    type: 'github',
    action: 'count'
  });

  ctx.body = {
    success: true,
    result: ''
  };
};

const getUserInfo = async (ctx) => {
  const { login } = ctx.query;
  const user = await UserAPI.getUser({
    login: login || ctx.session.githubLogin
  });

  ctx.body = {
    success: true,
    result: user
  };
};

const setUserInfo = async (ctx) => {
  const { userId } = ctx.session;
  const { info } = ctx.request.body;

  await UserAPI.updateUser(userId, info);
  ctx.body = {
    success: true
  };
};

export default {
  // user
  logout,
  loginByGitHub,
  initialFinished,
  clearCache,
  getUserInfo,
  setUserInfo,
};

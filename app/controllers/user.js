
import GitHubAPI from '../services/github';
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
    const githubToken = await GitHubAPI.getToken(code);
    const userInfo = await GitHubAPI.getLogin(githubToken);
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
      if (user && user.initialed) GitHubAPI.updateUserData(ctx.session.githubLogin, githubToken);
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

  await Promise.all([
    UserAPI.updateUser(userId, { initialed: true }),
    StatAPI.putStat({
      type: 'github',
      action: 'count'
    })
  ]);

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
    result: user,
    success: true,
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

const getUnreadNotifies = async (ctx) => {
  const { userId, locale } = ctx.session;

  const datas = await StatAPI.getUnreadNotifies(userId, locale);
  ctx.body = {
    result: datas,
    success: true
  };
};

const getNotifies = async (ctx) => {
  const { locale } = ctx.session;
  const datas = await StatAPI.getNotifies(locale);
  ctx.body = {
    result: datas,
    success: true
  };
};

const markNotifies = async (ctx) => {
  const { userId } = ctx.session;
  const { ids } = ctx.request.body;

  await StatAPI.markNotifies(userId, ids);
  ctx.body = {
    success: true
  };
};

const notifyUpvote = async (ctx) => {
  const { userId, githubLogin } = ctx.session;
  const { messageId } = ctx.params;
  notify('slack').send({
    mq: ctx.mq,
    data: {
      data: `Upvote ${messageId} by <https://github.com/${githubLogin}|${githubLogin}>`
    }
  });
  await StatAPI.notifyUpvote(userId, messageId);
  ctx.body = {
    success: true
  };
};

const notifyDownvote = async (ctx) => {
  const { userId, githubLogin } = ctx.session;
  const { messageId } = ctx.params;
  notify('slack').send({
    mq: ctx.mq,
    data: {
      data: `Downvote ${messageId} by <https://github.com/${githubLogin}|${githubLogin}>`
    }
  });
  await StatAPI.notifyDownvote(userId, messageId);
  ctx.body = {
    success: true
  };
};

export default {
  // user
  logout,
  clearCache,
  getUserInfo,
  setUserInfo,
  loginByGitHub,
  initialFinished,
  // notify
  getNotifies,
  markNotifies,
  notifyUpvote,
  notifyDownvote,
  getUnreadNotifies,
};

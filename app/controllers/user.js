
import network from '../services/network';
import getCacheKey from './helper/cacheKey';
import logger from '../utils/logger';
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
    const githubToken = await network.github.getToken(code);
    const userInfo = await network.github.getLogin(githubToken);
    logger.debug(userInfo);

    if (userInfo.login) {
      ctx.session.githubToken = githubToken;
      ctx.session.githubLogin = userInfo.login;

      const user = await network.user.createUser(userInfo);
      notify.slack({
        mq: ctx.mq,
        data: {
          type: 'login',
          data: `<https://github.com/${userInfo.login}|${userInfo.login}> logined!`
        }
      });

      logger.info(`[USER:LOGIN] ${JSON.stringify(user)}`);
      ctx.session.userId = user.userId;
      if (user && user.initialed) {
        network.github.updateUserData(ctx.session.githubLogin, githubToken);
      }
      return ctx.redirect(`/${ctx.session.githubLogin}`);
    }
    return ctx.redirect('/api/user/logout');
  } catch (err) {
    logger.error(err);
    return ctx.redirect('/api/user/logout');
  }
};

const initialFinished = async (ctx) => {
  const { userId } = ctx.session;

  await Promise.all([
    network.user.updateUser(userId, { initialed: true }),
    network.stat.putStat({
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
  const user = await network.user.getUser({
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

  await network.user.updateUser(userId, info);
  ctx.body = {
    success: true
  };
};

const getUnreadNotifies = async (ctx) => {
  const { userId, locale } = ctx.session;

  const datas = await network.stat.getUnreadNotifies(userId, locale);
  ctx.body = {
    result: datas,
    success: true
  };
};

const getNotifies = async (ctx) => {
  const { locale } = ctx.session;
  const datas = await network.stat.getNotifies(locale);
  ctx.body = {
    result: datas,
    success: true
  };
};

const markNotifies = async (ctx) => {
  const { userId } = ctx.session;
  const { ids } = ctx.request.body;

  await network.stat.markNotifies(userId, ids);
  ctx.body = {
    success: true
  };
};

const notifyUpvote = async (ctx) => {
  const { userId, githubLogin } = ctx.session;
  const { messageId } = ctx.params;
  notify.slack({
    mq: ctx.mq,
    data: {
      data: `Upvote ${messageId} by <https://github.com/${githubLogin}|${githubLogin}>`
    }
  });
  await network.stat.notifyUpvote(userId, messageId);
  ctx.body = {
    success: true
  };
};

const notifyDownvote = async (ctx) => {
  const { userId, githubLogin } = ctx.session;
  const { messageId } = ctx.params;
  notify.slack({
    mq: ctx.mq,
    data: {
      data: `Downvote ${messageId} by <https://github.com/${githubLogin}|${githubLogin}>`
    }
  });
  await network.stat.notifyDownvote(userId, messageId);
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

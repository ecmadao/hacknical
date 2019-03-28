
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

const patchUserInfo = async (ctx) => {
  const { userId } = ctx.session;
  const { info } = ctx.request.body;

  await network.user.updateUser(userId, info);
  ctx.body = {
    success: true
  }
}

const getUnreadNotifies = async (ctx) => {
  const { userId, locale } = ctx.session

  const datas = await network.stat.getUnreadNotifies(userId, locale)
  ctx.body = {
    result: datas,
    success: true
  }
}

const markNotifies = async (ctx) => {
  const { userId } = ctx.session
  const { ids } = ctx.request.body

  await network.stat.markNotifies(userId, ids)
  ctx.body = {
    success: true
  }
}

const vote = async (ctx, func, type) => {
  const { userId, githubLogin } = ctx.session
  const { messageId } = ctx.params
  notify.slack({
    mq: ctx.mq,
    data: {
      data: `${type.toUpperCase()} ${messageId} by <https://github.com/${githubLogin}|${githubLogin}>`
    }
  });
  await func(userId, messageId)
}

const notifyUpvote = async (ctx) => {
  await vote(ctx, network.stat.notifyUpvote, 'Upvote')
  ctx.body = {
    success: true
  }
}

const notifyDownvote = async (ctx) => {
  await vote(ctx, network.stat.notifyDownvote, 'Downvote')
  ctx.body = {
    success: true
  }
}

export default {
  // user
  logout,
  clearCache,
  getUserInfo,
  patchUserInfo,
  loginByGitHub,
  initialFinished,
  // notify
  markNotifies,
  notifyUpvote,
  notifyDownvote,
  getUnreadNotifies,
};

import config from 'config';
import User from '../models/users';
import Api from '../services/api';
import getCacheKey from './helper/cacheKey';
import { getMobileMenu, getGithubSections } from './shared';
import logger from '../utils/logger';

const qName = config.get('mq.qnameRefresh');

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

const githubLogin = async (ctx) => {
  const { code } = ctx.request.query;
  try {
    const githubToken = await Api.getToken(code);
    const userInfo = await Api.getLogin(githubToken);
    if (userInfo.login) {
      ctx.session.githubToken = githubToken;
      ctx.session.githubLogin = userInfo.login;
      const loginResult = await User.loginWithGithub(
        userInfo,
        ctx.cache,
        ctx.mq
      );

      if (loginResult.success) {
        const user = loginResult.result;
        logger.info(`[USER:LOGIN][${userInfo.login}]`);
        ctx.session.userId = user.userId;
        if (user.initialed) {
          ctx.mq.sendMessage({
            message: JSON.stringify({
              login: userInfo.login,
              token: githubToken
            }),
            qname: qName
          });
        }
        return ctx.redirect(`/${ctx.session.githubLogin}`);
      }
    }
    return ctx.redirect('/');
  } catch (err) {
    return ctx.redirect('/');
  }
};

const initialFinished = async (ctx) => {
  const { userId } = ctx.session;
  await User.updateUserInfo({
    userId,
    initialed: true
  });
  ctx.cache.hincrby('github', 'count', 1);

  ctx.body = {
    success: true,
    result: ''
  };
};

// user analysis mobile
const mobileAnalysis = async (ctx) => {
  await ctx.render('user/mobile/analysis', {
    title: ctx.__('mobilePage.analysis'),
    user: {
      isAdmin: true
    },
    menu: getMobileMenu(ctx)
  });
};

const mobileSetting = async (ctx) => {
  await ctx.render('user/mobile/setting', {
    title: ctx.__('mobilePage.setting'),
    user: {
      isAdmin: true
    },
    menu: getMobileMenu(ctx)
  });
};

const getGithubShareSections = async (ctx) => {
  const { login } = ctx.query;
  const sections = await User.findGithubSections(login || ctx.session.githubLogin);
  ctx.body = {
    success: true,
    result: sections
  };
};

const setGithubShareSections = async (ctx) => {
  const githubSections = getGithubSections(ctx.request.body);

  await User.updateGithubSections(ctx.session.githubLogin, githubSections);
  ctx.body = {
    success: true
  };
};

const getPinnedRepos = async (ctx) => {
  const { login } = ctx.query;
  const pinnedRepos = await User.findPinnedRepos(login || ctx.session.githubLogin);
  ctx.body = {
    success: true,
    result: pinnedRepos
  }
};

const setPinnedRepos = async (ctx, next) => {
  const login = ctx.session.githubLogin;
  const { pinnedRepos } = ctx.request.body;
  const repos = pinnedRepos.split(',');

  await User.updatePinnedRepos(login, repos);

  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey('repos', {
      session: ['githubLogin']
    }),
    cacheKey('commits', {
      session: ['githubLogin']
    }),
    cacheKey(`sharedUser.${login}`)
  ];

  ctx.body = {
    success: true
  };

  await next();
};

export default {
  // user
  logout,
  githubLogin,
  initialFinished,
  getPinnedRepos,
  setPinnedRepos,
  clearCache,
  // mobile
  mobileAnalysis,
  mobileSetting,
  // github sections
  getGithubShareSections,
  setGithubShareSections,
};

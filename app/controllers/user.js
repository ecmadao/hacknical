import config from 'config';
import User from '../models/users';
import Api from '../services/api';
import getCacheKey from './helper/cacheKey';
import getLanguages from '../config/languages';
import { getMobileMenu, getGithubSections } from './shared';
import logger from '../utils/logger';

const qName = config.get('mq.qnameRefresh');

const logout = async (ctx) => {
  ctx.session.userId = null;
  ctx.session.githubToken = null;
  ctx.session.githubLogin = null;
  ctx.redirect('/');
};

const loginPage = async (ctx) => {
  const locale = ctx.__('language.id');
  const languages = getLanguages(locale);
  const clientId = await Api.getVerify();
  await ctx.render('user/login', {
    locale,
    languages,
    clientId,
    title: ctx.__('loginPage.title'),
    login: ctx.__('loginPage.login'),
    about: ctx.__('loginPage.about'),
    loginText: ctx.__('loginPage.loginText'),
    loginButtonText: ctx.__('loginPage.loginButtonText'),
    languageText: ctx.__('language.text'),
    languageId: ctx.__('language.id'),
    statistic: {
      developers: ctx.__('loginPage.statistic.developers'),
      githubPageview: ctx.__('loginPage.statistic.githubPageview'),
      resumePageview: ctx.__('loginPage.statistic.resumePageview'),
      resumes: ctx.__('loginPage.statistic.resumes'),
    }
  });
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
        return ctx.redirect('/dashboard');
      }
    }
    return ctx.redirect('/user/login');
  } catch (err) {
    return ctx.redirect('/user/login');
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
  loginPage,
  githubLogin,
  initialFinished,
  getPinnedRepos,
  setPinnedRepos,
  // mobile
  mobileAnalysis,
  mobileSetting,
  // github sections
  getGithubShareSections,
  setGithubShareSections,
};

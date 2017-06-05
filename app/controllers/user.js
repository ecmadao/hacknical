import User from '../models/users';
import Api from '../services/api';
import getCacheKey from './helper/cacheKey';
import languages from '../../utils/languages';
import { getMobileMenu, getGithubSections } from './shared';

const logout = async (ctx, next) => {
  ctx.session.userId = null;
  ctx.session.githubToken = null;
  ctx.session.githubLogin = null;
  ctx.redirect('/');
};

const loginPage = async (ctx, next) => {
  const locale = ctx.__("language.id");
  const locales = languages(locale);
  const clientId = await Api.getVerify();
  await ctx.render('user/login', {
    locale,
    locales,
    title: ctx.__("loginPage.title"),
    login: ctx.__("loginPage.login"),
    about: ctx.__("loginPage.about"),
    loginText: ctx.__("loginPage.loginText"),
    loginButtonText: ctx.__("loginPage.loginButtonText"),
    languageText: ctx.__("language.text"),
    languageId: ctx.__("language.id"),
    isMobile: ctx.state.isMobile,
    clientId: clientId
  });
};

const githubLogin = async (ctx, next) => {
  const { code } = ctx.request.query;
  try {
    const githubToken = await Api.getToken(code);
    const userInfo = await Api.getLogin(githubToken);
    if (userInfo.login) {
      ctx.session.githubToken = githubToken;
      ctx.session.githubLogin = userInfo.login;
      const loginResult = await User.loginWithGithub(userInfo);
      if (loginResult.success) {
        ctx.session.userId = loginResult.result;
        return ctx.redirect('/dashboard');
      }
    }
    return ctx.redirect('/user/login');
  } catch (err) {
    return ctx.redirect('/user/login');
  }
};

const initialFinished = async (ctx, next) => {
  const { userId } = ctx.session;
  await User.updateUserInfo({
    userId,
    initialed: true
  });

  return ctx.body = {
    success: true,
    result: ''
  };
};

// user analysis mobile
const mobileAnalysis = async (ctx, next) => {
  await ctx.render('user/mobile/analysis', {
    title: ctx.__("mobilePage.analysis"),
    user: {
      isAdmin: true
    },
    menu: getMobileMenu(ctx)
  });
};

const mobileSetting = async (ctx, next) => {
  await ctx.render('user/mobile/setting', {
    title: ctx.__("mobilePage.setting"),
    user: {
      isAdmin: true
    },
    menu: getMobileMenu(ctx)
  });
};

const getGithubShareSections = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  const { login } = ctx.query;
  const sections = await User.findGithubSections(login || githubLogin);
  ctx.body = {
    success: true,
    result: sections
  };
};

const setGithubShareSections = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  const githubSections = getGithubSections(ctx.request.body);

  await User.updateGithubSections(githubLogin, githubSections);
  return ctx.body = {
    success: true
  };
};

const getPinnedRepos = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  const { login } = ctx.query;
  const pinnedRepos = await User.findPinnedRepos(login || githubLogin);
  ctx.body = {
    success: true,
    result: pinnedRepos
  }
};

const setPinnedRepos = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  const { pinnedRepos } = ctx.request.body;
  const repos = pinnedRepos.split(',');

  await User.updatePinnedRepos(githubLogin, repos);

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
  setGithubShareSections
};

import User from '../models/users';
import Resume from '../models/resumes';
import Api from '../services/api';
import languages from '../../utils/languages';
import { GITHUB_SECTIONS } from '../utils/datas';

const logout = async (ctx, next) => {
  ctx.session.userId = null;
  ctx.session.githubToken = null;
  ctx.session.githubLogin = null;
  ctx.redirect('/');
};

const loginPage = async (ctx, next) => {
  const locale = ctx.__("language.id");
  const locales = languages(locale);
  const verifyResult = await Api.getVerify();
  await ctx.render('user/login', {
    locale,
    locales,
    title: ctx.__("loginPage.title"),
    login: ctx.__("loginPage.login"),
    about: ctx.__("loginPage.about"),
    loginText: ctx.__("loginPage.loginText"),
    languageText: ctx.__("language.text"),
    languageId: ctx.__("language.id"),
    isMobile: ctx.state.isMobile,
    clientId: verifyResult && verifyResult.clientId
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
        return ctx.redirect('/user/dashboard');
      }
    }
    return ctx.redirect('/user/login');
  } catch (err) {
    return ctx.redirect('/user/login');
  }
};

// user dashboard
const dashboard = async (ctx, next) => {
  const { userId, githubLogin } = ctx.session;
  if (ctx.state.isMobile) {
    ctx.redirect(`/github/${githubLogin}`);
  }

  await ctx.render('user/dashboard', {
    title: ctx.__("dashboard.title", githubLogin)
  });
};

// user analysis mobile
const mobileAnalysis = async (ctx, next) => {
  if (!ctx.state.isMobile) {
    return ctx.redirect('/user/dashboard');
  }
  await ctx.render('user/mobile/analysis', {
    title: ctx.__("mobilePage.analysis"),
    user: {
      isAdmin: true
    },
    menu: {
      shareDatas: ctx.__("mobilePage.menu.shareDatas"),
      githubAnalysis: ctx.__("mobilePage.menu.githubAnalysis"),
      dataRefresh: ctx.__("mobilePage.menu.dataRefresh"),
      logout: ctx.__("mobilePage.menu.logout"),
    }
  });
};

const mobileSetting = async (ctx, next) => {
  if (!ctx.state.isMobile) {
    return ctx.redirect('/user/dashboard');
  }
  await ctx.render('user/mobile/setting', {
    title: ctx.__("mobilePage.setting"),
    user: {
      isAdmin: true
    },
    menu: {
      shareDatas: ctx.__("mobilePage.menu.shareDatas"),
      githubAnalysis: ctx.__("mobilePage.menu.githubAnalysis"),
      dataRefresh: ctx.__("mobilePage.menu.dataRefresh"),
      logout: ctx.__("mobilePage.menu.logout"),
    }
  });
};

const getGithubSections = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  const { login } = ctx.query;
  const sections = await User.findGithubSections(login || githubLogin);
  return ctx.body = {
    success: true,
    result: sections
  }
};

const setGithubSections = async (ctx, next) => {
  const { githubLogin } = ctx.session;

  let githubSections = {};
  const { body } = ctx.request;
  Object.keys(body).forEach((key) => {
    if (GITHUB_SECTIONS.some(section => section === key)) {
      githubSections[key] = body[key];
    }
  });

  await User.updateGithubSections(githubLogin, githubSections);
  return ctx.body = {
    success: true
  };
};

export default {
  // user
  logout,
  loginPage,
  githubLogin,
  // dashboard
  dashboard,
  // mobile
  mobileAnalysis,
  mobileSetting,
  // github sections
  getGithubSections,
  setGithubSections
}


/*

const login = async (ctx, next) => {
  const { email, pwd } = ctx.request.body;
  const loginResult = await User.login(email, pwd);
  const { message, success, result } = loginResult;
  if (success) {
    ctx.session.userId = result;
  }
  ctx.body = {
    message,
    success
  };
};

const signup = async (ctx, next) => {
  const { email, pwd } = ctx.request.body;
  const signupResult = await User.createUser(email, pwd);
  const { message, success, result } = loginResult;
  if (success) {
    const { _id, userName, email } = result;
    ctx.session.userId = _id;
    await Resume.initialResume(_id, {
      email,
      name: userName
    });
  }
  ctx.body = {
    message,
    success
  };
};

 */

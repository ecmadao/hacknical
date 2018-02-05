
import User from '../models/users';
import Api from '../services/api';
import getLanguages from '../config/languages';

const landingPage = async (ctx) => {
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

const handle404 = async (ctx) => {
  await ctx.render('error/404', {
    title: ctx.__('errorPage.title'),
    text: ctx.__('errorPage.text'),
    redirectText: ctx.__('errorPage.redirectText')
  });
};

const dashboard = async (ctx) => {
  const { githubLogin, userId } = ctx.session;
  const user = await User.findOne({ userId });

  if (!user) {
    ctx.redirect('/user/logout');
  }

  if (!user.initialed) {
    ctx.redirect('/initial');
  }

  if (ctx.state.isMobile) {
    ctx.redirect(`/github/${githubLogin}/mobile`);
  }

  await ctx.render('user/dashboard', {
    title: ctx.__('dashboard.title', githubLogin),
    login: githubLogin
  });
};

const initial = async (ctx) => {
  const { githubLogin, userId } = ctx.session;
  const user = await User.findOne({ userId });
  if (user.initialed) {
    ctx.redirect(`/${githubLogin}`);
  }
  await ctx.render('user/initial', {
    title: `initializing ${githubLogin}`,
    login: githubLogin
  });
};

const statistic = async (ctx) => {
  const usersCount = await ctx.cache.get('users');
  const githubHashFields = await ctx.cache.hgetall('github');
  const resumeHashFields = await ctx.cache.hgetall('resume');

  ctx.body = {
    success: true,
    result: {
      users: usersCount,
      github: githubHashFields,
      resume: resumeHashFields
    }
  };
};

const languages = async (ctx) => {
  const locale = ctx.__('language.id');
  const avaliableLanguages = getLanguages(locale);

  ctx.body = {
    success: true,
    result: avaliableLanguages
  };
};

export default {
  landingPage,
  handle404,
  dashboard,
  initial,
  statistic,
  languages,
};

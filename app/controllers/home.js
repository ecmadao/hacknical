
import GitHubAPI from '../services/github';
import getLanguages from '../config/languages';
import logger from '../utils/logger';
import UserAPI from '../services/user';
import StatAPI from '../services/stat';

const landingPage = async (ctx) => {
  const { locale } = ctx.state;
  const languages = getLanguages(locale);
  const clientId = await GitHubAPI.getVerify();

  await ctx.render('user/login', {
    languages,
    clientId,
    title: ctx.__('loginPage.title'),
    login: ctx.__('loginPage.login'),
    about: ctx.__('loginPage.about'),
    loginText: ctx.__('loginPage.loginText'),
    loginButtonText: ctx.__('loginPage.loginButtonText'),
    languageText: ctx.__('language.text'),
    languageId: locale,
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
  const { login, dashboardRoute = 'visualize' } = ctx.params;
  const { githubLogin, userId } = ctx.session;
  const user = await UserAPI.getUser({ userId });

  logger.debug(`githubLogin: ${githubLogin}, userId: ${userId}`);
  logger.debug(user);

  if (!user || !userId) {
    return ctx.redirect('/user/logout');
  }

  if (!user.initialed) {
    ctx.redirect('/initial');
  }
  await ctx.render('user/dashboard', {
    dashboardRoute,
    login: githubLogin,
    isAdmin: login === githubLogin,
    title: ctx.__('dashboard.title', githubLogin),
  });
};

const initial = async (ctx) => {
  const { githubLogin, userId } = ctx.session;
  logger.debug(`githubLogin: ${githubLogin}, userId: ${userId}`);
  const user = await UserAPI.getUser({ userId });

  logger.debug(user);

  if (user.initialed) {
    ctx.redirect(`/${githubLogin}`);
  }
  const title = ctx.__('initialPage.title', githubLogin);
  await ctx.render('user/initial', {
    title,
    login: githubLogin
  });
};

const combineStat = stats => stats.reduce((pre, cur) => {
  pre[cur.action] = (pre[cur.action] || 0) + cur.count;
  return pre;
}, {});

const statistic = async (ctx) => {
  const [
    users,
    githubFields,
    resumeFields
  ] = await Promise.all([
    UserAPI.getUserCount(),
    StatAPI.getStat({ type: 'github' }),
    StatAPI.getStat({ type: 'resume' })
  ]);

  const github = combineStat(githubFields || []);
  const resume = combineStat(resumeFields || []);

  ctx.body = {
    success: true,
    result: {
      users,
      github,
      resume
    }
  };
};

const languages = async (ctx) => {
  const avaliableLanguages = getLanguages(ctx.state.locale);

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

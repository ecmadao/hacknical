
import network from '../services/network';
import getLanguages from '../config/languages';
import logger from '../utils/logger';
import notify from '../services/notify';

const landingPage = async (ctx) => {
  const { locale } = ctx.state;
  const languages = getLanguages(locale);
  const clientId = await network.github.getVerify();

  await ctx.render('user/login', {
    clientId,
    languages,
    languageId: locale,
    title: ctx.__('loginPage.title'),
    login: ctx.__('loginPage.login'),
    about: ctx.__('loginPage.about'),
    languageText: ctx.__('language.text'),
    loginText: ctx.__('loginPage.loginText'),
    loginButtonText: ctx.__('loginPage.loginButtonText'),
    statistic: {
      resumes: ctx.__('loginPage.statistic.resumes'),
      developers: ctx.__('loginPage.statistic.developers'),
      githubPageview: ctx.__('loginPage.statistic.githubPageview'),
      resumePageview: ctx.__('loginPage.statistic.resumePageview'),
    }
  });
};

const handle404 = async (ctx) => {
  await ctx.render('error/404', {
    text: ctx.__('errorPage.text'),
    title: ctx.__('errorPage.title'),
    redirectText: ctx.__('errorPage.redirectText')
  });
};

const dashboard = async (ctx) => {
  const { device, browser, platform } = ctx.state;
  const { githubLogin, userId } = ctx.session;
  const { login, dashboardRoute = 'visualize' } = ctx.params;
  const user = await network.user.getUser({ userId });

  logger.debug(`githubLogin: ${githubLogin}, userId: ${userId}`);
  logger.debug(user);

  if (!user || !userId) {
    return ctx.redirect('/user/logout');
  }

  if (!user.initialed) {
    ctx.redirect('/initial');
  }
  notify.slack({
    mq: ctx.mq,
    data: {
      data: `【USAGE:${githubLogin}】${device.toUpperCase()}:${platform.toUpperCase()}:${browser.toUpperCase()}`
    }
  });
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
  const user = await network.user.getUser({ userId });

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
    network.user.getUserCount(),
    network.stat.getStat({ type: 'github' }),
    network.stat.getStat({ type: 'resume' })
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
  initial,
  statistic,
  languages,
  handle404,
  dashboard,
  landingPage,
};

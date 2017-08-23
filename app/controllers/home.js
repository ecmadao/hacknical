
import User from '../models/users';
import getLanguages from '../config/languages';

const index = async (ctx) => {
  ctx.redirect('/dashboard');
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
    ctx.redirect('/dashboard');
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
  index,
  handle404,
  dashboard,
  initial,
  statistic,
  languages,
};

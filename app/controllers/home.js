
import User from '../models/users/index';

const index = async (ctx, next) => {
  ctx.redirect('/dashboard');
};

const handle404 = async (ctx, next) => {
  await ctx.render('error/404', {
    title: ctx.__("errorPage.title"),
    text: ctx.__("errorPage.text"),
    redirectText: ctx.__("errorPage.redirectText")
  });
};

const dashboard = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  if (ctx.state.isMobile) {
    ctx.redirect(`/github/${githubLogin}/mobile`);
  }

  await ctx.render('user/dashboard', {
    title: ctx.__("dashboard.title", githubLogin)
  });
};

export default {
  index,
  handle404,
  dashboard
}

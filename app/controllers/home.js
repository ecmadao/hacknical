
import User from '../models/users/index';

const index = async (ctx, next) => {
  ctx.redirect('/user/dashboard');
};

const handle404 = async (ctx, next) => {
  await ctx.render('error/404', {
    title: ctx.i18n.__("errorPage.title"),
    text: ctx.i18n.__("errorPage.text"),
    redirectText: ctx.i18n.__("errorPage.redirectText")
  });
}

export default {
  index,
  handle404
}

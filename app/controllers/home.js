
import User from '../models/users/index';

const index = async (ctx, next) => {
  ctx.redirect('/user/dashboard');
};

const handle404 = async (ctx, next) => {
  await ctx.render('error/404', {
    title: ctx.__("errorPage.title"),
    text: ctx.__("errorPage.text"),
    redirectText: ctx.__("errorPage.redirectText")
  });
}

export default {
  index,
  handle404
}

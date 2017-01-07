
import User from '../models/users/index';

const index = async (ctx, next) => {
  ctx.redirect('/user/dashboard');
};

const handle404 = async (ctx, next) => {
  await ctx.render('error/404', {
    title: '没有找到页面'
  });
}

export default {
  index,
  handle404
}

import logger from '../utils/logger';

const catchError = () => async (ctx, next) => {
  try {
    await next();
    const { url } = ctx;
    if (ctx.status === 404) {
      if (new RegExp('dashboard').test(url)) {
        await ctx.redirect('/dashboard');
        return;
      }
      await ctx.redirect(`/404?locale=${ctx.session.locale}`);
    }
  } catch (err) {
    logger.error(err);
    ctx.redirect('/user/logout');
  }
}

export default catchError;

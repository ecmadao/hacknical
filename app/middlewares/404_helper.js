import logger from 'koa-logger';

const catch404 = () => async (ctx, next) => {
  try {
    await next();
    const url = ctx.url;
    if (ctx.status === 404) {
      if (new RegExp('dashboard').test(url)) {
        await ctx.redirect('/user/dashboard');
        return;
      }
      await ctx.redirect('/404')
    }
  } catch(err) {
    logger.error('404 error', err, ctx);
  }
}

export default catch404;

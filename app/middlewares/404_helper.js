import logger from 'koa-logger';

const catch404 = () => async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) {
      await ctx.redirect('/404')
    }
  } catch(err) {
    logger.error('404 error', err, ctx);
  }
}

export default catch404;

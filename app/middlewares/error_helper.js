import logger from '../utils/logger';

const catchError = () => async (ctx, next) => {
  try {
    await next();
    const { url } = ctx;
    if (ctx.status === 404) {
      const login = url.split('/')[0];
      await ctx.redirect(`/${login}`);
    }
  } catch (err) {
    logger.error(err);
    ctx.redirect('/user/logout');
  }
}

export default catchError;

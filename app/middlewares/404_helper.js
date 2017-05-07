import log from '../utils/log';

const catch404 = () => async (ctx, next) => {
  try {
    await next();
    const url = ctx.url;
    if (ctx.status === 404) {
      if (new RegExp('dashboard').test(url)) {
        await ctx.redirect('/dashboard');
        return;
      }
      await ctx.redirect(`/404?locale=${ctx.session.locale}`);
    }
  } catch(err) {
    log.error(err);
  }
}

export default catch404;

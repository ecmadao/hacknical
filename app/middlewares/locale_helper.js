
const checkLocale = () => async (ctx, next) => {
  const { locale } = ctx.query;
  if (locale) {
    ctx.session.locale = locale;
  } else if (!ctx.session.locale) {
    ctx.session.locale = 'en';
  }

  const sessionLocale = ctx.session.locale;
  ctx.state.locale = sessionLocale;
  ctx.state.description = ctx.__("description");
  ctx.state.keywords = ctx.__("keywords");
  await next();
};

export default checkLocale;

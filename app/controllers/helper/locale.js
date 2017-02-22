
const locale = async (ctx, next) => {
  const { locale } = ctx.query;
  if (locale) {
    ctx.session.locale = locale;
  } else if (!ctx.session.locale) {
    ctx.session.locale = 'en';
  }

  ctx.state.locale = ctx.session.locale;
  await next();
};

export default locale

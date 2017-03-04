
const validateLocale = (locale) => {
  const language = locale;
  if (!language) { return '' }
  if (/^en/.test(language)) {
    return 'en';
  }
  if (/^fr/.test(language)) {
    return 'fr';
  }
  if (/^zh/.test(language)) {
    return 'zh';
  }
  return 'zh';
};

const checkLocale = () => async (ctx, next) => {
  const locale = validateLocale(ctx.query.locale);
  if (locale) {
    ctx.session.locale = locale;
  } else if (!ctx.session.locale) {
    ctx.session.locale = 'zh';
  }

  const sessionLocale = ctx.session.locale;
  ctx.state.locale = sessionLocale;
  ctx.state.description = ctx.__("description");
  ctx.state.keywords = ctx.__("keywords");

  await next();
};

export default checkLocale;

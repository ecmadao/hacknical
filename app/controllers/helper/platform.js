
const setPlatform = () => async (ctx, next) => {
  const { userAgent } = ctx;
  ctx.state.browser = userAgent.browser;
  ctx.state.platform = userAgent.platform;
  ctx.state.isMobile = userAgent.isMobile;
  await next();
};

const checkMobile = (redirectUrl = null) => async (ctx, next) => {
  const { path, querystring } = ctx.request;
  const { isMobile } = ctx.state;
  const requestMobile = /\/mobile/.test(path);

  if (isMobile && !requestMobile) {
    return ctx.redirect(redirectUrl || `${path}/mobile?${querystring}`);
  }
  if (!isMobile && requestMobile) {
    return ctx.redirect(redirectUrl || `${path.replace('/mobile', '')}?${querystring}`);
  }
  await next();
};

export default {
  setPlatform,
  checkMobile
};

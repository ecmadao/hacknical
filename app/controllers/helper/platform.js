
const checkPlatform = async (ctx, next) => {
  const userAgent = ctx.state.userAgent;
  ctx.state.browser = userAgent.browser;
  ctx.state.platform = userAgent.platform;
  ctx.state.isMobile = userAgent.isMobile;
  await next();
};

const checkMobile = (redirectUrl) => async (ctx, next) => {
  const { path, querystring } = ctx.request;
  const { isMobile } = ctx.state;
  const requestMobile = /\/mobile/.test(path);

  if (isMobile && !requestMobile) {
    ctx.redirect(redirectUrl || `${path}/mobile?${querystring}`);
    return;
  }
  if (!isMobile && requestMobile) {
    ctx.redirect(redirectUrl || `${path.replace('/mobile', '')}?${querystring}`);
    return;
  }
  await next();
};

export default {
  checkPlatform,
  checkMobile
};

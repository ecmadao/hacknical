// import geoip from 'geoip-lite';

const checkPlatform = async (ctx, next) => {
  const userAgent = ctx.state.userAgent;
  // const geo = geoip.lookup(ctx.request.ip);
  // console.log(geo);
  ctx.state.browser = userAgent.browser;
  ctx.state.platform = userAgent.platform;
  ctx.state.isMobile = userAgent.isMobile;
  await next();
};

const checkMobile = (redirectUrl) => async (ctx, next) => {
  const { path, querystring } = ctx.request;
  const requestMobile = /\/mobile/.test(path);

  if (ctx.state.isMobile && !requestMobile) {
    ctx.redirect(redirectUrl || `${path}/mobile?${querystring}`)
  }
  if (!ctx.state.isMobile && requestMobile) {
    ctx.redirect(redirectUrl || `${path.replace('/mobile', '')}?${querystring}`);
  }
  await next();
};

export default {
  checkPlatform,
  checkMobile
}

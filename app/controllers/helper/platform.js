
const checkPlatform = async (ctx, next) => {
  const userAgent = ctx.state.userAgent;
  ctx.state.browser = userAgent.browser;
  ctx.state.platform = userAgent.platform;
  ctx.state.isMobile = userAgent.isMobile;
  await next();
};


export default {
  checkPlatform
}

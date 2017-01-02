
const checkPlatform = async (ctx, next) => {
  const userAgent = ctx.state.userAgent;
  ctx.state.isMobile = userAgent.isMobile;
  await next();
};


export default {
  checkPlatform
}

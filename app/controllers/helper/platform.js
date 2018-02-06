
const setPlatform = () => async (ctx, next) => {
  const { userAgent } = ctx;
  ctx.state.browser = userAgent.browser;
  ctx.state.platform = userAgent.platform;
  ctx.state.isMobile = userAgent.isMobile;
  await next();
};

export default {
  setPlatform,
};

import logger from '../utils/logger';

const setPlatform = () => async (ctx, next) => {
  const { userAgent } = ctx;
  ctx.state.browser = userAgent.browser;
  ctx.state.platform = userAgent.platform;
  ctx.state.isMobile = userAgent.isMobile;
  await next();
  const { githubLogin } = ctx.session;
  logger.info(
    `[${userAgent.browser}][${userAgent.platform}]${
      userAgent.isMobile ? '[Mobile]' : '[Desktop]'
    }${githubLogin ? `[LOGIN:${githubLogin}]` : ''}`
  );
};

export default {
  setPlatform,
};

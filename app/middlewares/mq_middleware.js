import getMQ from '../utils/mq';
import logger from '../utils/logger';

let mq = null;

const mqMiddleware = (options = {}) => {
  if (!mq) mq = getMQ(options);
  try {
    mq.createQueue();
  } catch (e) {
    logger.error(e);
  }

  return async (ctx, next) => {
    ctx.mq = mq;
    await next();
  };
};

export default mqMiddleware;

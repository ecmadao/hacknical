import config from 'config';
import getMQ from '../utils/mq';
import logger from '../utils/logger';

let mq = null;
const mqConfig = config.get('mq');
const messengerQName = mqConfig.qname;
const refreshQName = mqConfig.qnameRefresh;

const mqMiddleware = (options = {}) => {
  if (!mq) mq = getMQ(options);
  try {
    mq.createQueue(messengerQName);
  } catch (e) {
    logger.error(e);
  }
  try {
    mq.createQueue(refreshQName);
  } catch (e) {
    logger.error(e);
  }

  return async (ctx, next) => {
    ctx.mq = mq;
    await next();
  };
};

export default mqMiddleware;

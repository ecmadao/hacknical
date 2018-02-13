import config from 'config';
import getMQ from '../utils/mq';
import logger from '../utils/logger';

let mq = null;
const mqChannels = config.get('mq.channels');

const mqMiddleware = (options = {}) => {
  if (!mq) mq = getMQ(options);
  for (const key of Object.keys(mqChannels)) {
    const qName = mqChannels[key];
    try {
      mq.createQueue(qName);
    } catch (e) {
      logger.error(e);
    }
  }
  return async (ctx, next) => {
    ctx.mq = mq;
    await next();
  };
};

export default mqMiddleware;

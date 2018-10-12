
import config from 'config';
import MessageQueue from '../utils/mq';

const qname = config.get('mq.qname');

const mqMiddleware = () => {
  const mq = new MessageQueue(qname);
  return async (ctx, next) => {
    ctx.mq = mq;
    await next();
  };
};

export default mqMiddleware;

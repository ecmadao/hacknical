import RedisSMQ from 'rsmq';
import config from 'config';
import logger from './logger';

const mqConfig = config.get('mq');
const mqName = mqConfig.qname;

const wrap = (func, ...params) =>
  new Promise((resolve, reject) => {
    func(...params, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });

export const wrapMsg = ({ message, type, url }) => {
  const msg = {
    data: message,
    channel: {
      url,
      type,
    },
  };
  return JSON.stringify(msg);
};

class MessageQueue {
  constructor(options = {}) {
    const initOptions = Object.assign({}, mqConfig.config, options);
    this.mq = new RedisSMQ(initOptions);
    logger.info(`[MQ:CONNECT][${initOptions.host}:${initOptions.port}]`);
  }

  createQueue(qname = mqName) {
    return wrap(this.mq.createQueue, { qname });
  }

  sendMessage(options = {}) {
    const {
      message,
      qname = mqName
    } = options;
    if (!message) return;
    logger.info(`[MQ:SEND][${message}]`);
    return wrap(this.mq.sendMessage, {
      qname,
      message
    });
  }
}

let instance = null;

const getMQ = (options) => {
  if (instance) return instance;
  instance = new MessageQueue(options);
  return instance;
};

export default getMQ;

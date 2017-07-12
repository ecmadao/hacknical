import RedisSMQ from 'rsmq';
import config from 'config';
import logger from './logger';

const mqConfig = config.get('mq');
const slack = config.get('services.slack');
const mqName = mqConfig.qname;

const wrap = (func, ...params) =>
  new Promise((resolve, reject) => {
    func(...params, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });

class MsgFormatter {
  constructor() {
    this._loginMsg = this._loginMsg.bind(this);
    this._signupMsg = this._signupMsg.bind(this);
    this._viewMsg = this._viewMsg.bind(this);
    this._resumeMsg = this._resumeMsg.bind(this);
    this._downloadMsg = this._downloadMsg.bind(this);
  }

  format(msg) {
    if (msg.type) {
      return this.formatMsg[msg.type](msg.data);
    }
    return msg;
  }

  get formatMsg() {
    return {
      login: this._loginMsg,
      signup: this._signupMsg,
      resume: this._resumeMsg,
      download: this._downloadMsg,
      view: this._viewMsg
    };
  }

  _signupMsg(data) {
    return `*🎉 Signup*\n>${data}`;
  }

  _loginMsg(data) {
    return `*😝 Login*\n>${data}`;
  }

  _viewMsg(data) {
    return `*👀 Page View*\n>${data}`;
  }

  _resumeMsg(data) {
    return `*🚀 Resume*\n>${data}`;
  }

  _downloadMsg(data) {
    return `*😎 Download*\n>${data}`;
  }
}


class MessageQueue {
  constructor(options = {}) {
    const initOptions = Object.assign({}, mqConfig.config, options);
    this.mq = new RedisSMQ(initOptions);
    this.formatter = new MsgFormatter();
    logger.info(`[MQ:CONNECT][${initOptions.host}:${initOptions.port}]`);
  }

  wrapMsg(msg) {
    const message = {
      data: this.formatter.format(msg),
      channel: {
        type: 'slack',
        url: slack.url
      }
    };
    return JSON.stringify(message);
  }

  createQueue(qname = mqName) {
    return wrap(this.mq.createQueue, { qname });
  }

  sendMessage(message, qname = mqName) {
    return wrap(this.mq.sendMessage, {
      qname,
      message: this.wrapMsg(message)
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

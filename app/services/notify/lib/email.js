
import config from 'config';
import { wrapMsg } from './shared';

const homepage = config.get('httpsUrl');
const sendcloud = config.get('services.sendcloud');
const qName = config.get('mq.channels')['qname-messenger'];
const EMAIL_URL = sendcloud.url;
const API_USER = sendcloud.user;
const API_KEY = sendcloud.key;
const REPLY_TO = sendcloud.replyTo;
const TEMPLATES = sendcloud.templates;

class EmailMsg {
  constructor(mq) {
    this.mq = mq;
  }

  send(options = {}) {
    if (!EMAIL_URL) return;
    const {
      to,
      template,
      msg = { '%url%': [homepage] },
    } = options;
    const templateOptions = this._getOptions(template);
    const sendOptions = Object.assign({}, {
      replyTo: REPLY_TO,
      apiUser: API_USER,
      apiKey: API_KEY,
      subject: 'welcome to hacknical'
    }, templateOptions, {
      xsmtpapi: JSON.stringify({
        to: [to],
        sub: msg
      }),
    });
    this.mq.sendMessage({
      message: wrapMsg({
        message: sendOptions,
        type: 'email',
        url: EMAIL_URL,
      }),
      qname: qName
    });
  }

  _getOptions(templateKey) {
    const template = TEMPLATES[templateKey] || {};
    return {
      templateInvokeName: template.id,
      fromName: template.fromName,
      from: template.from
    };
  }
}

export default EmailMsg;

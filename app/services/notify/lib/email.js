
import config from 'config';

const email = config.get('services.messenger.email');
const qName = config.get('mq.channels')['qname-messenger'];

class EmailMsg {
  constructor(mq) {
    this.mq = mq;
  }

  async send(options = {}) {
    const {
      to,
      msg,
      template = email.template,
    } = options;

    email.channel && await this.mq.sendMessage({
      message: {
        data: {
          to,
          msg,
          template,
        },
        type: email.type,
        channel: email.channel
      },
      qname: qName
    });
  }
}

export default EmailMsg;

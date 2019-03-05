
import config from 'config'

const email = config.get('services.messenger.email')

class EmailMsg {
  constructor(mq) {
    this.mq = mq
  }

  async send(options = {}) {
    const {
      to,
      msg,
      template = email.template
    } = options

    email.channel && await this.mq.sendMessage(JSON.stringify({
      data: {
        to,
        msg,
        template
      },
      type: email.type,
      channel: email.channel
    }))
  }
}

export default EmailMsg

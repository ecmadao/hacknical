
import config from 'config'

const email = config.get('services.messenger.email')
const CHANNEL = email.channel

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

    CHANNEL && await this.mq.send(JSON.stringify({
      data: {
        to,
        msg,
        template
      },
      type: email.type,
      channel: CHANNEL
    }))
  }
}

export default EmailMsg

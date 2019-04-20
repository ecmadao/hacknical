
import config from 'config'

const slack = config.get('services.messenger.slack')
const CHANNEL = slack.channel

class SlackMsg {
  constructor(mq) {
    this.mq = mq
  }

  async send(msg) {
    const message = this.format(msg)

    CHANNEL && await this.mq.send(JSON.stringify({
      data: message,
      type: 'slack',
      channel: CHANNEL
    }))
  }

  format(msg) {
    if (msg.type) {
      return `*😝 ${msg.type.toUpperCase()}*\n>${msg.data}`
    }
    return msg.data
  }
}

export default SlackMsg

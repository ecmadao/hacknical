
import config from 'config'

const slack = config.get('services.messenger.slack')

class SlackMsg {
  constructor(mq) {
    this.mq = mq
  }

  async send(msg) {
    const message = this.format(msg)

    slack.channel && await this.mq.sendMessage(JSON.stringify({
      data: message,
      type: 'slack',
      channel: slack.channel
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

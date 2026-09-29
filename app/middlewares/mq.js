
import config from 'config'
import mq from 'mq-utils'

const mqConfig = config.get('mq')

const createNoopQueue = () => ({
  async send() {
    return true
  }
})

const MQ = mqConfig.source === 'noop'
  ? null
  : mq[mqConfig.source](mqConfig.config)

const mqMiddleware = () => {
  const queue = MQ
    ? new MQ(mqConfig.channels.messenger, mqConfig.options)
    : createNoopQueue()
  return async (ctx, next) => {
    ctx.mq = queue
    await next()
  }
}

export default mqMiddleware

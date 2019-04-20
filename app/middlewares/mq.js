
import config from 'config'
import mq from 'mq-utils'

const mqConfig = config.get('mq')
const MQ = mq[mqConfig.source](mqConfig.config)

const mqMiddleware = () => {
  const queue = new MQ(mqConfig.channels.messenger, mqConfig.options)
  return async (ctx, next) => {
    ctx.mq = queue
    await next()
  }
}

export default mqMiddleware

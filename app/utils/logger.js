import log4js from 'log4js'
import config from 'config'

const logConfig = config.get('log')
const appName = config.get('appName')

log4js.configure({
  appenders: {
    out: { type: 'stdout' }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: (logConfig && logConfig.level) || 'debug'
    }
  }
})

const logger = log4js.getLogger(`[${appName.toUpperCase()}]`)

export default logger

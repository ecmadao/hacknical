
import log4js from 'log4js'
import config from 'config'

const logConfig = config.get('log')
const appName = config.get('appName')

log4js.configure({
  appenders: [
    logConfig.appender
  ]
})

const logger = log4js.getLogger(`[${appName.toUpperCase()}]`)
logger.setLevel(logConfig.level)

export default logger

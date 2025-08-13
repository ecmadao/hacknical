
import log4js from 'log4js'
import config from 'config'

const logConfig = config.get('log')
const appName = config.get('appName')

// Create a deep copy to avoid immutability issues with newer config versions
const logAppenderCopy = JSON.parse(JSON.stringify(logConfig.appender))

log4js.configure({
  appenders: [
    logAppenderCopy
  ]
})

const logger = log4js.getLogger(`[${appName.toUpperCase()}]`)
logger.setLevel(logConfig.level)

export default logger

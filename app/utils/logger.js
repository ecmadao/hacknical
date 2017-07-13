import log4js from 'log4js';
import config from 'config';

const appName = config.get('appName');
const logFile = config.get('logFile');

if (!logFile) {
  log4js.configure({
    appenders: [
      { type: 'console' }
    ]
  });
} else {
  log4js.configure({
    appenders: [
      { type: 'file', filename: logFile, }
    ]
  });
}

const logger = log4js.getLogger(`[${appName.toUpperCase()}]`);
logger.setLevel('INFO');

export default logger;

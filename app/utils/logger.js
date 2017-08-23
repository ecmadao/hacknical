import log4js from 'log4js';
import config from 'config';

const appName = config.get('appName');

log4js.configure({
  appenders: [
    { type: 'console' }
  ]
});

const logger = log4js.getLogger(`[${appName.toUpperCase()}]`);
logger.setLevel('INFO');

export default logger;

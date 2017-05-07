import debug from 'debug';
import config from 'config';

const appName = config.get('appName');
/**
 * wrap three log function based on 'debug' package.
 */
export default {
  error: debug(`${appName}:error`),
  debug: debug(`${appName}:debug`),
  info: debug(`${appName}:info`)
};

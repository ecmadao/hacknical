
import config from 'config';
import getMongo from '../utils/database';
import logger from '../utils/logger';

const url = config.get('database.mongo');

const mongoMiddleware = () => async (ctx, next) => {
  try {
    ctx.db = await getMongo(url);
  } catch (e) {
    logger.error(e);
  }
  await next();
};

export default mongoMiddleware;

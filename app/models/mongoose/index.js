import mongoose from 'mongoose';
import config from 'config';
import logger from '../../utils/logger';

const mongodbUrl = config.get('database.url');

function handleErr(err) {
  if (err) {
    logger.error('connect to %s error: ', mongodbUrl, err.message);
    process.exit(1);
  }
}

if (process.env.NODE_ENV === 'production') {
  mongoose.connect(mongodbUrl, { auth: { authdb: 'admin' } }, handleErr);
} else {
  mongoose.connect(mongodbUrl, handleErr);
}

mongoose.Promise = global.Promise;

export default mongoose;

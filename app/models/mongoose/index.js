import mongoose from 'mongoose';
import config from 'config';
import logger from '../../utils/logger';

const mongodbUrl = config.get('database.mongo');

function handleErr(err) {
  if (err) {
    logger.error('connect to %s error: ', mongodbUrl, err.message);
  }
}

if (process.env.NODE_ENV === 'production') {
  mongoose.connect(mongodbUrl, {
    useMongoClient: true
  }, handleErr);
} else {
  mongoose.connect(mongodbUrl, {
    useMongoClient: true
  }, handleErr);
}

mongoose.Promise = global.Promise;

export default mongoose;

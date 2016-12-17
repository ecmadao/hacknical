import mongoose from 'mongoose';
import config from 'config';

const mongodbUrl = config.get('database.url');

mongoose.connect(mongodbUrl, function (err) {
  if (err) {
    console.error('connect to %s error: ', mongodbUrl, err.message);
    process.exit(1);
  }
});
mongoose.Promise = global.Promise;

export default mongoose;

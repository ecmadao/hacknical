import mongoose from 'mongoose';
import config from 'config';

const mongodbUrl = config.get('database.url');

function handleErr(err) {
  if (err) {
    console.error('connect to %s error: ', mongodbUrl, err.message);
    process.exit(1);
  }
}

if (process.env.NODE_ENV === 'production') {
  mongoose.connect(mongodbUrl, { auth: { authdb: "admin" } }, handleErr);
} else {
  mongoose.connect(mongodbUrl, handleErr);
}

mongoose.Promise = global.Promise;

export default mongoose;

import mongoose from '../mongoose/index';

const Schema = mongoose.Schema;

const ResumePubSchema = new Schema({
  userId: String,
  timestamp: Number,
  maxView: Number,
  resumeHash: String,
  openShare: { type: Boolean, default: true }
});

export default mongoose.model('ResumePub', ResumePubSchema);

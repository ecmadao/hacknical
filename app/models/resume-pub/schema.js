import mongoose from '../mongoose/index';

const Schema = mongoose.Schema;

const ResumePubSchema = new Schema({
  userId: String,
  resumeId: String,
  timestamp: Number,
  maxView: Number,
  resumeHash: String
});

export default mongoose.model('ResumePub', ResumePubSchema);

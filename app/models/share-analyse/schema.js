import mongoose from '../mongoose/index';

const Schema = mongoose.Schema;

const ShareAnalyseSchema = new Schema({
  login: String,
  userId: String,
  url: String,
  enable: {
    type: Boolean,
    default: true
  },
  pageViews: [{
    viewCount: Number,
    viewDate: String
  }]
}, {
  timestamps: { createdAt: 'created_at' }
});

export default mongoose.model('ShareAnalyse', ShareAnalyseSchema);

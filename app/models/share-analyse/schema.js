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
    count: Number,
    date: String
  }],
  viewDevices: [{
    platform: String,
    count: Number
  }],
  viewSources: [{
    browser: String,
    from: String,
    count: Number
  }]
}, {
  timestamps: { createdAt: 'created_at' }
});

export default mongoose.model('ShareAnalyse', ShareAnalyseSchema);

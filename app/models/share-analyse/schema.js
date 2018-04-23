import mongoose from '../mongoose';

const MongoSchema = mongoose.Schema;

const ShareAnalyseSchema = new MongoSchema({
  login: String,
  url: String,
  type: String,
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

ShareAnalyseSchema.index({
  login: 1,
  type: 1,
});

export default mongoose.model('ShareAnalyse', ShareAnalyseSchema);

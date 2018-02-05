import mongoose from '../mongoose';

const MongoSchema = mongoose.Schema;

const ShareAnalyseSchema = new MongoSchema({
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

ShareAnalyseSchema.index({
  userId: 1,
  login: 1,
  url: 1,
  enable: 1,
});

export default mongoose.model('ShareAnalyse', ShareAnalyseSchema);

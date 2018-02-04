import mongoose from '../mongoose';

const MongoSchema = mongoose.Schema;

const UserSchema = new MongoSchema({
  userName: String,
  userId: String,
  passwordHash: String,
  passwordSalt: String,
  lastLoginTime: {
    type: Date,
    default: Date.now
  },
  email: String,
  openShare: { type: Boolean, default: true },
  githubLogin: { type: String, default: '' },
  githubInfo: {
    id: { type: String, default: '' },
    login: { type: String, default: '' }
  },
  pinnedRepos: { type: Array, default: [] },
  githubSections: {
    hotmap: { type: Boolean, default: true },
    info: { type: Boolean, default: true },
    repos: { type: Boolean, default: true },
    languages: { type: Boolean, default: true },
    commits: { type: Boolean, default: true },
    orgs: { type: Boolean, default: true },
    course: { type: Boolean, default: true },
    contributed: { type: Boolean, default: true },
    statistic: { type: Boolean, default: true },
  },
  initialed: { type: Boolean, default: false },
  notification: {
    weekly: { type: Boolean, default: true },
    update: { type: Boolean, default: true },
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

UserSchema.index({
  userName: 1,
  userId: 1,
  email: 1,
  githubLogin: 1,
  githubInfo: {
    login: 1
  }
});

export default mongoose.model('Users', UserSchema);

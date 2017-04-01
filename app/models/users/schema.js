import mongoose from '../mongoose/index';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: String,
  passwordHash: String,
  passwordSalt: String,
  lastLoginTime: {
    type: Date,
    default: Date.now
  },
  email: String,
  openShare: { type: Boolean, default: true },
  githubId: { type: String, default: '' },
  githubLogin: { type: String, default: '' },
  githubInfo: {
    login: { type: String, default: '' }
  },
  orgs: [{
    login: String,
    avatar_url: String,
    description: String
  }],
  githubSections: {
    hotmap: { type: Boolean, default: true },
    info: { type: Boolean, default: true },
    repos: { type: Boolean, default: true },
    languages: { type: Boolean, default: true },
    commits: { type: Boolean, default: true },
    orgs: { type: Boolean, default: true },
    course: { type: Boolean, default: true }
  },
  initialed: { type: Boolean, default: false }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.model('Users', UserSchema);

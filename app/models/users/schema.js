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
  githubInfo: {
    name: String,
    login: String,
    avatar_url: String,
    company: String,
    blog: String,
    location: String,
    email: String,
    bio: String,
    created_at: String,
    updated_at: String,
    public_repos: String,
    public_gists: String,
    followers: String,
    following: String,
    html_url: String,
    lastUpdateTime: Date
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
    orgs: { type: Boolean, default: true }
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.model('Users', UserSchema);

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
  githubId: { type: String, default: '' },
  githubInfo: {
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
    following: String
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.model('Users', UserSchema);

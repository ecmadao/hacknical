import mongoose from '../mongoose/index';

const Schema = mongoose.Schema;

const OrgSchema = new Schema({
  lastLoginTime: {
    type: Date,
    default: Date.now
  },
  orgInfo: {
    name: String,
    login: String,
    avatar_url: String,
    company: String,
    blog: String,
    location: String,
    email: String,
    description: String,
    created_at: String,
    updated_at: String,
    type: String,
    public_repos: String,
    public_gists: String,
    followers: String,
    following: String,
    html_url: String
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.model('Orgs', OrgSchema);

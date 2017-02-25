import mongoose from '../mongoose/index';

const Schema = mongoose.Schema;

const OrgSchema = new Schema({
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
  html_url: String,
  repos: [{
    full_name: String,
    name: String,
    html_url: String,
    description: String,
    fork: Boolean,
    created_at: String,
    updated_at: String,
    pushed_at: String,
    homepage: String,
    size: Number,
  	stargazers_count: Number,
  	watchers_count: Number,
  	language: String,
    languages: { type: Object, default: {} },
  	forks_count: Number,
  	forks: Number,
  	watchers: Number,
    contributors: { type: Array, default: [] }
  }]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.model('Orgs', OrgSchema);

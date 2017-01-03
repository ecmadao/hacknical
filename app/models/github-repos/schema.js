import mongoose from '../mongoose/index';

const Schema = mongoose.Schema;

const GithubReposSchema = new Schema({
  userId: String,
  reposId: String,
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
  languages: Object,
	forks_count: Number,
	forks: Number,
	watchers: Number,
	subscribers_count: Number
});

export default mongoose.model('GithubRepos', GithubReposSchema);

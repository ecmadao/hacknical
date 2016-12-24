import mongoose from '../mongoose/index';

const Schema = mongoose.Schema;

const GithubCommitsSchema = new Schema({
  userId: String,
  reposId: String,
  commits: Array
});

export default mongoose.model('GithubCommits', GithubCommitsSchema);

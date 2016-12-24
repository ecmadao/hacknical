import mongoose from '../mongoose/index';

const Schema = mongoose.Schema;

const GithubCommitsSchema = new Schema({
  userId: String,
  reposId: String,
  name: String,
  commits: [{
    days: Array,
    total: Number,
    week: Number
  }]
});

export default mongoose.model('GithubCommits', GithubCommitsSchema);

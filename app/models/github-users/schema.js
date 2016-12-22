import mongoose from '../mongoose/index';

const Schema = mongoose.Schema;

const GithubUsersSchema = new Schema({
  userId: String,
  reposIds: Array,
  sections: [{
    id: String,
    show: Boolean
  }]
});

export default mongoose.model('GithubUsers', GithubUsersSchema);

import User from '../models/users/index';
import Github from '../services/github';
import GithubRepos from '../models/github-repos';

export const getAndSetRepos = async (login, token, userId) => {
  const repos = await Github.getRepos(login, token);
  const setResults = await GithubRepos.setRepos(userId, repos);
  return setResults;
};

const getRepos = async (ctx, next) => {
  const { userId, githubLogin, githubToken } = ctx.session;
  const result = await getAndSetRepos(githubLogin, githubToken, userId);
  ctx.body = {
    success: true,
    result
  };
};

const getRepository = async (ctx, next) => {

};

const getReadme = async (ctx, next) => {

};

export default {
  getRepos,
  getRepository,
  getReadme
}

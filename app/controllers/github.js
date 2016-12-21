import User from '../models/users/index';
import Github from '../services/github';
import GithubRepos from '../models/github-repos';

export const getAndSetRepos = async (login, token, userId) => {
  const multiRepos = await Github.getMultiRepos(login, token);
  const setResults = await GithubRepos.setRepos(userId, multiRepos);
  return setResults;
};

const getRepos = async (ctx, next) => {
  const { userId, githubLogin, githubToken } = ctx.session;
  const result = await getAndSetRepos(githubLogin, githubToken, userId);
  ctx.body = {
    success: true,
    result
  };
  await next();
};

const getRepository = async (ctx, next) => {
  await next();
};

const getReadme = async (ctx, next) => {
  await next();
};

export default {
  getRepos,
  getRepository,
  getReadme
}

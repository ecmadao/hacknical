import User from '../models/users/index';
import Github from '../services/github';
import GithubRepos from '../models/github-repos';
import GithubCommits from '../models/github-commits';

/**
 * private
 */
const getAndSetRepos = async (login, token, userId) => {
  const findResult = await GithubRepos.getRepos(userId);
  if (findResult) {
    return findResult;
  }
  const multiRepos = await Github.getMultiRepos(login, token);
  const setResults = await GithubRepos.setRepos(userId, multiRepos);
  return setResults;
};

/**
 * private
 */
const getAndSetCommits = async (userId, token) => {
  const findCommits = await GithubCommits.getUserCommits(userId);
  if (findCommits.result.length) {
    return findCommits.result;
  }
  const fintRepos = await GithubRepos.getRepos(userId);
  const fetchResults = await Github.getAllReposYearlyCommits(fintRepos, token);
  await GithubCommits.addUserCommits(userId, fetchResults);
  return fetchResults;
};

/**
 * private
 */
// const getAndSetRepositoryCommits = async (userId, token) => {
//
// }


const getUser = async (ctx, next) => {
  const { userId } = ctx.session;
  const findResult = await User.findUserById(userId);
  if (findResult) {
    ctx.body = {
      success: true,
      result: findResult.githubInfo || {}
    };
    return;
  }
  ctx.body = {
    success: true,
    message: '查找用户失败'
  };
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

const getCommits = async (ctx, next) => {
  const { userId, githubToken } = ctx.session;
  const result = await getAndSetCommits(userId, githubToken);
  ctx.body = {
    success: true,
    result
  };
  await next();
};

const getRepositoryCommits = async (ctx, next) => {

};

export default {
  getUser,
  getRepos,
  getRepository,
  getCommits,
  getRepositoryCommits
}

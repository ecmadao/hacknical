import User from '../models/users/index';
import Github from '../services/github';
import GithubRepos from '../models/github-repos';
import GithubCommits from '../models/github-commits';
import {
  validateReposList,
  sortByCommits
} from '../utils/github';

/**
 * private
 */
const getAndSetRepos = async (login, token, userId) => {
  const findResult = await GithubRepos.getRepos(userId);
  if (findResult.length) {
    return findResult;
  }
  const multiRepos = await Github.getMultiRepos(login, token);
  const setResults = await GithubRepos.setRepos(userId, multiRepos);
  return setResults;
};

/**
 * private
 */
const setCommits = async (repos, userId, token) => {
  const reposList = validateReposList(repos);
  const fetchCommits = await Github.getAllReposYearlyCommits(reposList, token);
  const results = fetchCommits.map((commits, index) => {
    const repository = reposList[index];
    const { reposId, name, created_at, pushed_at } = repository;
    let totalCommits = 0;
    commits.forEach(commit => totalCommits += commit.total);
    return {
      commits,
      totalCommits,
      reposId,
      name,
      created_at,
      pushed_at
    }
  });
  const sortResult = sortByCommits(results);
  await GithubCommits.addUserCommits(userId, sortResult);
  return sortResult;
};

/**
 * private
 */
const getAndSetCommits = async (userId, token) => {
  const findCommits = await GithubCommits.getUserCommits(userId);
  if (findCommits.length) {
    return sortByCommits(findCommits);
  }
  const findRepos = await GithubRepos.getRepos(userId);
  const result = await setCommits(findRepos, userId, token);
  return result;
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
  const repos = await getAndSetRepos(githubLogin, githubToken, userId);
  const commits = await getAndSetCommits(userId, githubToken);
  ctx.body = {
    success: true,
    result: {
      repos,
      commits
    }
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
  await next();
};

const getStareInfo = async (ctx, next) => {
  const login = ctx.params.login;
  const user = await User.findUserByLogin(login);
  const { _id } = user;
  const repos = await GithubRepos.getRepos(_id);
  const commits = await GithubCommits.getUserCommits(_id);

  ctx.body = {
    success: true,
    result: {
      repos,
      commits: sortByCommits(commits)
    }
  }
  await next();
};

const sharePage = async (ctx, next) => {
  const login = ctx.params.login;
  const user = await User.findUserByLogin(login);
  const { githubInfo } = user;
  const {
    bio,
    name,
    created_at,
    avatar_url,
    public_repos,
    followers,
    following
  } = githubInfo;

  await ctx.render('user/share', {
    user: {
      bio,
      name,
      login,
      avatar_url,
      public_repos,
      followers,
      following,
      created_at: created_at.split('T')[0]
    },
    title: `${githubInfo.name}的2016年github总结`
  });
};

export default {
  getUser,
  sharePage,
  getStareInfo,
  getRepos,
  getRepository,
  getCommits,
  getRepositoryCommits
}

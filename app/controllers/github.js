import User from '../models/users/index';
import Github from '../services/github';
import GithubRepos from '../models/github-repos';
import GithubCommits from '../models/github-commits';
import ShareAnalyse from '../models/share-analyse';
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
  try {
    const reposLanguages = await Github.getAllReposLanguages(multiRepos, token);
    multiRepos.forEach((repository, index) => repository.languages = reposLanguages[index]);
  } catch (err) {}
  const setResults = await GithubRepos.setRepos(userId, multiRepos);
  return setResults;
};

/**
 * private
 */
const setCommits = async (repos, userId, token) => {
  const reposList = validateReposList(repos);
  try {
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
  } catch (err) {
    return [];
  }
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

const toggleShare = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  const { enable } = ctx.query;
  await ShareAnalyse.changeShareStatus({
    enable,
    login: githubLogin,
    url: `github/${githubLogin}`
  });
  ctx.body = {
    success: true
  };
};

const getUser = async (ctx, next) => {
  const { userId } = ctx.session;
  const findResult = await User.findUserById(userId);
  if (findResult) {
    const { githubInfo } = findResult;
    const { login } = githubInfo;
    const shareAnalyse = await ShareAnalyse.findShare({ login, url: `github/${login}` });
    const {
      bio,
      url,
      name,
      blog,
      email,
      avatar_url,
      html_url,
      company,
      location,
      followers,
      following,
      public_repos,
      created_at
    } = githubInfo;
    ctx.body = {
      success: true,
      result: {
        bio,
        url,
        name,
        blog,
        login,
        email,
        avatar_url,
        html_url,
        company,
        location,
        followers,
        following,
        public_repos,
        created_at,
        openShare: shareAnalyse.enable
      }
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
  if (!commits.length || !repos.length) {
    ctx.query.shouldCache = false;
  }
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
  const { login } = ctx.params;
  const user = await User.findUserByLogin(login);
  const { _id } = user;
  const { githubToken } = ctx.session;
  const repos = await getAndSetRepos(login, githubToken, _id);
  const commits = await getAndSetCommits(_id, githubToken);
  if (!commits.length || !repos.length) {
    ctx.query.shouldCache = false;
  }

  ctx.body = {
    success: true,
    result: {
      repos,
      commits: sortByCommits(commits)
    }
  }
  await next();
};

const getSharedUser = async (ctx, next) => {
  const { login } = ctx.params;

  const user = await User.findUserByLogin(login);
  if (user) {
    ctx.body = {
      success: true,
      result: user.githubInfo || {}
    };
    return;
  }
  ctx.body = {
    success: true,
    message: '查找用户失败'
  };
};

const sharePage = async (ctx, next) => {
  const { login } = ctx.params;
  const { githubLogin } = ctx.session;
  const user = await User.findUserByLogin(login);
  if (!user) {
    ctx.redirect('/404');
    return;
  }
  const { githubInfo } = user;
  const title = `${githubInfo.name || githubInfo.login}的2016年github总结`;

  if (!ctx.state.isMobile) {
    await ctx.render('user/share', {
      user: {
        login,
        isAdmin: login === githubLogin
      },
      title
    });
    return;
  }

  const {
    bio,
    name,
    created_at,
    avatar_url,
    public_repos,
    followers,
    following
  } = githubInfo;
  await ctx.render('user/share_mobile', {
    user: {
      bio,
      name: name || login,
      login,
      avatar_url,
      public_repos,
      followers,
      following,
      isAdmin: login === githubLogin,
      created_at: created_at.split('T')[0]
    },
    title
  });
};

export default {
  getUser,
  getSharedUser,
  sharePage,
  getStareInfo,
  getRepos,
  getRepository,
  getCommits,
  getRepositoryCommits,
  toggleShare
}

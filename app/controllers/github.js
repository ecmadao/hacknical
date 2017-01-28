import User from '../models/users/index';
import Github from '../services/github';
import GithubRepos from '../models/github-repos';
import GithubCommits from '../models/github-commits';
import ShareAnalyse from '../models/share-analyse';
import {
  validateReposList,
  sortByCommits
} from '../utils/github';
import dateHelper from '../utils/date';
import getCacheKey from './helper/cacheKey';

const HALF_AN_HOUR = 30 * 60;

/* ================== private helper ================== */

/**
 * repos
 */
const fetchRepos = async (login, token, userId) => {
  const multiRepos = await Github.getMultiRepos(login, token);
  try {
    const reposLanguages = await Github.getAllReposLanguages(multiRepos, token);
    multiRepos.forEach((repository, index) => repository.languages = reposLanguages[index]);
  } catch (err) {}
  const setResults = await GithubRepos.setRepos(userId, multiRepos);
  return setResults;
};

const getRepos = async (login, token, userId) => {
  const findResult = await GithubRepos.getRepos(userId);
  if (findResult.length) {
    return findResult;
  }
  return await fetchRepos(login, token, userId);
};

/**
 * commits
 */
const fetchCommits = async (repos, userId, token) => {
  const reposList = validateReposList(repos);
  try {
    const fetchedCommits = await Github.getAllReposYearlyCommits(reposList, token);
    const results = fetchedCommits.map((commits, index) => {
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
    await GithubCommits.setCommits(userId, sortResult);
    return sortResult;
  } catch (err) {
    return [];
  }
};

const getCommits = async (userId, token) => {
  const findCommits = await GithubCommits.getCommits(userId);
  if (findCommits.length) {
    return sortByCommits(findCommits);
  }
  const findRepos = await GithubRepos.getRepos(userId);
  return await fetchCommits(findRepos, userId, token);
};

/**
 * github info
 */
const fetchGithubInfo = async (githubToken) => {
  return await Github.getUser(githubToken);
};


/* ================== router handler ================== */

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

const getUserRepos = async (ctx, next) => {
  const { userId, githubLogin, githubToken } = ctx.session;
  const repos = await getRepos(githubLogin, githubToken, userId);
  const commits = await getCommits(userId, githubToken);
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

const getReposCommits = async (ctx, next) => {
  const { userId, githubToken } = ctx.session;

  const result = await getCommits(userId, githubToken);
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
  const repos = await getRepos(login, githubToken, _id);
  const commits = await getCommits(_id, githubToken);
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
  const title = `${githubInfo.name || githubInfo.login}的 github 总结`;

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

const getStareData = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  const url = `github/${githubLogin}`;
  const shareAnalyse = await ShareAnalyse.findShare({ login: githubLogin, url });
  const { viewDevices, viewSources, pageViews, enable } = shareAnalyse;
  ctx.body = {
    success: true,
    result: {
      url,
      openShare: enable,
      viewDevices,
      viewSources,
      pageViews
    }
  };
};

const getUpdateTime = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  const findResult = await User.findUserByLogin(githubLogin);
  if (findResult) {
    const { githubInfo } = findResult;
    ctx.body = {
      success: true,
      result: githubInfo.lastUpdateTime || findResult['created_at']
    };
    return;
  }
  ctx.body = {
    success: true,
    message: '查找用户失败'
  };
};

const refreshDatas = async (ctx, next) => {
  const { githubToken, githubLogin, userId } = ctx.session;

  // check update frequency
  const user = await User.findUserById(userId);
  const { githubInfo } = user;
  const timeInterval = dateHelper.getSeconds(new Date()) - dateHelper.getSeconds(githubInfo.lastUpdateTime);
  if (timeInterval <= HALF_AN_HOUR) {
    return ctx.body = {
      success: true,
      message: `更新过于频繁，请在${parseInt((HALF_AN_HOUR - timeInterval) / 60, 10)}分钟后重试`
    };
  }

  try {
    const userInfo = await fetchGithubInfo(githubToken);
    const githubUser = JSON.parse(userInfo);
    const updateUserResult = await User.updateUser(githubUser);
    const repos = await fetchRepos(githubLogin, githubToken, userId);
    await fetchCommits(repos, userId, githubToken);

    // set cache keys to remove
    const cacheKey = getCacheKey(ctx);
    ctx.query.deleteKeys = [
      cacheKey('repos'),
      cacheKey('user'),
      cacheKey(`sharedUser.${githubLogin}`),
      cacheKey(`sharedInfo.${githubLogin}`)
    ];

    ctx.body = {
      success: true,
      result: updateUserResult.result
    };
  } catch (err) {
    ctx.body = {
      success: true,
      result: new Date(),
      message: '数据更新失败'
    };
  }

  await next();
};

export default {
  getUser,
  getSharedUser,
  sharePage,
  getStareInfo,
  getUserRepos,
  getRepository,
  getReposCommits,
  getRepositoryCommits,
  toggleShare,
  getStareData,
  getUpdateTime,
  refreshDatas
}

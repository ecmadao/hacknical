import User from '../models/users';
import Orgs from '../models/orgs';
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

/*
 * check which part can be showed in github
 */
const checkGithubPart = (options) => (target) => {
  if (!options.length) { return true; }
  return options.some(option => option === target);
};

/**
 * repos
 */
const fetchRepos = async (login, token, userId, pages = 2) => {
  const multiRepos = await Github.getPersonalPubRepos(login, token, pages);
  try {
    const reposLanguages = await Github.getAllReposLanguages(multiRepos, token);
    multiRepos.forEach((repository, index) => repository.languages = reposLanguages[index]);
  } catch (err) {}
  const setResults = await GithubRepos.setRepos(userId, multiRepos);
  return setResults;
};

const getRepos = async (login, token, options) => {
  const { publicRepos, userId } = options;
  const pages = Math.ceil(publicRepos / 100);
  const findResult = await GithubRepos.getRepos(userId);
  if (findResult.length) {
    return findResult;
  }
  return await fetchRepos(login, token, userId, pages);
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
 * orgs
 */
const fetchOrg = async (orgLogin, token) => {
  const org = await Github.getOrg(orgLogin, token);
  if (!org.login) {
    return {};
  }

  const repos = await Github.getOrgPubRepos(orgLogin, token);

  // set repos languages
  try {
    const reposLanguages = await Github.getAllReposLanguages(repos, token);
    repos.forEach((repository, index) => repository.languages = reposLanguages[index]);
  } catch (err) {}

  // set repos contributors
  try {
    const reposContributors = await Github.getAllReposContributors(repos, token);
    repos.forEach((repository, index) => repository.contributors = reposContributors[index]);
  } catch (err) {}

  org.repos = repos;
  await Orgs.create(org);
  return org;
};

const fetchOrgs = async (login, token) => {
  const pubOrgs = await Github.getPersonalPubOrgs(login, token);
  const orgs = await getDetailOrgs(pubOrgs);
  await User.updateUserOrgs(login, pubOrgs);
  return orgs;
};

const getDetailOrgs = async (pubOrgs, token) => {
  const orgs = [];
  for(let i = 0; i < pubOrgs.length; i++) {
    const orgLogin = pubOrgs[i].login;
    let org = await Orgs.find(orgLogin);
    if (!org) {
      org = await fetchOrg(orgLogin, token);
    }
    orgs.push(org);
  }
  return orgs;
};

const getOrgs = async (login, token) => {
  const findUser = await User.findUserByLogin(login);
  const pubOrgs = findUser.orgs;
  if (pubOrgs && pubOrgs.length) {
    return await getDetailOrgs(pubOrgs, token);
  }
  return await fetchOrgs(login, token);
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
  const { enable } = ctx.request.body;
  await ShareAnalyse.changeShareStatus({
    enable,
    url: `github/${githubLogin}`
  });
  const message = enable === 'true' ? "messages.share.toggleOpen" : "messages.share.toggleClose"
  ctx.body = {
    success: true,
    message: ctx.__(message)
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
    return ctx.body = {
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
        openShare: shareAnalyse.enable,
        shareUrl: `github/${login}?locale=${ctx.session.locale}`
      }
    };
  }
  ctx.body = {
    success: true,
    error: ctx.__("messages.error.findUser")
  };
};

const getUserRepos = async (ctx, next) => {
  const { userId, githubLogin, githubToken } = ctx.session;

  const user = await User.findUserById(userId);
  const repos = await getRepos(githubLogin, githubToken, {
    userId,
    publicRepos: user.githubInfo.public_repos
  });
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

const getUserOrgs = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session;
  const { login } = ctx.query;
  const orgs = await getOrgs(githubLogin || login, githubToken);
  ctx.body = {
    success: true,
    result: {
      orgs
    }
  };
  // await next();
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
  const { _id, githubInfo } = user;
  const { githubToken } = ctx.session;
  const repos = await getRepos(login, githubToken, {
    userId: _id,
    publicRepos: githubInfo.public_repos
  });
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
    return ctx.body = {
      success: true,
      result: user.githubInfo || {}
    };
  }
  ctx.body = {
    success: true,
    error: ctx.__("messages.error.findUser")
  };
};

const sharePage = async (ctx, next) => {
  const { login } = ctx.params;
  const { githubLogin } = ctx.session;

  const shareAnalyse = await ShareAnalyse.findShare({ login, url: `github/${login}` });
  const user = await User.findUserByLogin(login);
  if (!user || !shareAnalyse.enable) {
    ctx.redirect('/404');
    return;
  }
  const { githubInfo } = user;
  const title = ctx.__("sharePage.github", githubInfo.name || githubInfo.login);

  if (!ctx.state.isMobile) {
    await ctx.render('user/share', {
      user: {
        login,
        isAdmin: login === githubLogin
      },
      title,
      shareText: ctx.__("messages.share.text")
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
  await ctx.render('user/mobile/share', {
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
    title,
    shareText: ctx.__("messages.share.mobileText"),
    joinAt: ctx.__("sharePage.joinAt"),
    menu: {
      shareDatas: ctx.__("mobilePage.menu.shareDatas"),
      githubAnalysis: ctx.__("mobilePage.menu.githubAnalysis"),
      dataRefresh: ctx.__("mobilePage.menu.dataRefresh"),
      logout: ctx.__("mobilePage.menu.logout"),
    }
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
      url: `${url}?locale=${ctx.session.locale}`,
      viewDevices,
      viewSources,
      pageViews,
      openShare: enable
    }
  };
};

const getUpdateTime = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  const findResult = await User.findUserByLogin(githubLogin);
  if (findResult) {
    const { githubInfo } = findResult;
    return ctx.body = {
      success: true,
      result: githubInfo.lastUpdateTime || findResult['created_at']
    };
  }
  ctx.body = {
    success: true,
    error: ctx.__("messages.error.findUser")
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
      error: ctx.__("messages.error.frequent", parseInt((HALF_AN_HOUR - timeInterval) / 60, 10) + "")
    };
  }

  try {
    const userInfo = await fetchGithubInfo(githubToken);
    const githubUser = JSON.parse(userInfo);
    const updateUserResult = await User.updateUser(githubUser);
    const { public_repos } = githubUser;
    const pages = Math.ceil(parseInt(public_repos, 10) / 100);
    const repos = await fetchRepos(githubLogin, githubToken, userId, pages);
    await fetchCommits(repos, userId, githubToken);

    // set cache keys to remove
    const cacheKey = getCacheKey(ctx);
    ctx.query.deleteKeys = [
      cacheKey('repos', {
        session: ['githubLogin']
      }),
      cacheKey('user', {
        session: ['githubLogin']
      }),
      cacheKey(`sharedUser.${githubLogin}`),
      cacheKey(`sharedInfo.${githubLogin}`)
    ];

    ctx.body = {
      success: true,
      message: ctx.__("messages.success.update"),
      result: updateUserResult.result
    };
  } catch (err) {
    ctx.body = {
      success: true,
      result: new Date(),
      error: ctx.__("messages.error.update")
    };
  }
  await next();
};

const getZen = async (ctx) => {
  const result = await Github.getZen();
  ctx.body = {
    success: true,
    result
  }
};

const getOctocat = async (ctx) => {
  const result = await Github.getOctocat();
  ctx.body = {
    success: true,
    result
  }
};

export default {
  getUser,
  getSharedUser,
  sharePage,
  getStareInfo,
  getUserRepos,
  getUserOrgs,
  getRepository,
  getReposCommits,
  getRepositoryCommits,
  toggleShare,
  getStareData,
  getUpdateTime,
  refreshDatas,
  getZen,
  getOctocat
}

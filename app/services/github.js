import config from 'config';
import fetch from '../utils/fetch';

const clientId = config.get('github.clientId');
const clientSecret = config.get('github.clientSecret');
const appName = config.get('github.appName');

const BASE_URL = 'https://api.github.com';
const API_TOKEN = 'https://github.com/login/oauth/access_token';
const API_GET_USER = `${BASE_URL}/user`;

const API_USERS = `${BASE_URL}/users`;
const API_ORGS = `${BASE_URL}/orgs`;
const API_REPOS = `${BASE_URL}/repos`;

/* =========================== basic funcs =========================== */

const fetchGithub = (url, option = {}) => {
  const options = {
    url,
    headers: { 'User-Agent': appName }
  };
  return fetch.get(options, option.parse);
};

const postGithub = (url) => {
  const options = {
    url
  };
  return fetch.post(options);
};

/* =========================== private funcs =========================== */

const getUserRepos = (login, token, page = 1) => {
  return fetchGithub(`${API_USERS}/${login}/repos?per_page=100&page=${page}&access_token=${token}`);
};

const getOrgRepos = (org, token, page = 1) => {
  return fetchGithub(`${API_ORGS}/${org}/repos?per_page=100&page=${page}&access_token=${token}`);
}

const getUserPubOrgs = (login, token, page = 1) => {
  return fetchGithub(`${API_USERS}/${login}/orgs?per_page=100&page=${page}&access_token=${token}`);
};

const getReposYearlyCommits = (fullname, token) => {
  return fetchGithub(`${API_REPOS}/${fullname}/stats/commit_activity?access_token=${token}`);
};

const getReposLanguages = async (fullname, token) => {
  let result = {};
  try {
    const languages = await fetchGithub(`${API_REPOS}/${fullname}/languages?access_token=${token}`);
    let total = 0;
    Object.keys(languages).forEach(key => total += languages[key]);
    Object.keys(languages).forEach(key => result[key] = languages[key] / total);
  } catch (err) {
    result = {};
  } finally {
    return Promise.resolve(result);
  }
};

const getReposContributors = async (fullname, token) => {
  let results = [];
  try {
    const contributors = await fetchGithub(`${API_REPOS}/${fullname}/stats/contributors?access_token=${token}`);
    results = contributors.map((contributor, index) => {
      const { total, weeks, author } = contributor;
      const weeklyCommits = weeks.map((week, index) => {
        const { w, a, d, c } = week;
        return {
          week: w,
          data: parseInt((a + d + c), 10)
        }
      });
      const { avatar_url, login } = author;
      return {
        total,
        login,
        avatar_url,
        weeks: weeklyCommits
      }
    });
  } catch (err) {
    results = [];
  } finally {
    return Promise.resolve(results);
  }
};


/* =========================== github api =========================== */

const getOctocat = () => {
  return fetchGithub(`${BASE_URL}/octocat?client_id=${clientId}&client_secret=${clientSecret}`, {
    parse: false
  });
};

const getZen = () => {
  return fetchGithub(`${BASE_URL}/zen?client_id=${clientId}&client_secret=${clientSecret}`, {
    parse: false
  });
};

const getToken = (code) => {
  return postGithub(`${API_TOKEN}?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {
    parse: false
  })
};

const getUser = (token) => {
  return fetchGithub(`${API_GET_USER}?access_token=${token}`, {
    parse: false
  });
};

const getOrg = (org, token) => {
  return fetchGithub(`${API_ORGS}/${org}?access_token=${token}`);
};

const getOrgPubRepos = (org, token, pages = 1) => {
  const promiseList = new Array(pages).fill(0).map((item, index) => {
    return getOrgRepos(org, token, index + 1);
  });
  return Promise.all(promiseList).then((datas) => {
    let results = [];
    datas.forEach(data => results = [...results, ...data]);
    return Promise.resolve(results);
  }).catch(() => Promise.resolve([]));
};

const getPersonalPubRepos = (login, token, pages = 3) => {
  const promiseList = new Array(pages).fill(0).map((item, index) => {
    return getUserRepos(login, token, index + 1);
  });
  return Promise.all(promiseList).then((datas) => {
    let results = [];
    datas.forEach(data => results = [...results, ...data]);
    return Promise.resolve(results);
  }).catch(() => Promise.resolve([]));
};

const getPersonalPubOrgs = (login, token, pages = 1) => {
  const promiseList = new Array(pages).fill(0).map((item, index) => {
    return getUserPubOrgs(login, token, index + 1);
  });
  return Promise.all(promiseList).then((datas) => {
    let results = [];
    datas.forEach(data => results = [...results, ...data]);
    return Promise.resolve(results);
  }).catch(() => Promise.resolve([]));
};

const getAllReposYearlyCommits = (repos, token) => {
  const promiseList = repos.map((item, index) => {
    return getReposYearlyCommits(item.fullname || item.full_name, token);
  });
  return Promise.all(promiseList).catch(() => Promise.resolve([]));
};

const getAllReposLanguages = (repos, token) => {
  const promiseList = repos.map((item, index) => {
    return getReposLanguages(item.fullname || item.full_name, token);
  });
  return Promise.all(promiseList).catch(() => Promise.resolve([]));
};

const getAllReposContributors = (repos, token) => {
  const promiseList = repos.map((item, index) => {
    return getReposContributors(item.fullname || item.full_name, token);
  });
  return Promise.all(promiseList).catch(() => Promise.resolve([]));
};

export default {
  // others
  getZen,
  getOctocat,
  getToken,
  // user
  getUser,
  getPersonalPubRepos,
  getPersonalPubOrgs,
  // org
  getOrg,
  getOrgPubRepos,
  // repos
  getAllReposYearlyCommits,
  getAllReposLanguages,
  getAllReposContributors
}

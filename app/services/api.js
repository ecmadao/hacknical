import fetch from '../utils/fetch';
import config from 'config';

const appName = config.get('appName');


/* =========================== basic funcs =========================== */

const fetchApi = (url, options = {}) => {
  const {
    qs,
    timeouts,
    headers = {},
  } = options;
  headers['X-App-Name'] = appName;
  return fetch.get({
    qs,
    url,
    headers,
  }, timeouts);
};

/* =========================== api funcs =========================== */

const getZen = async token => fetchApi('/zen', {
  qs: { token }
});
const getOctocat = async () => fetchApi('/octocat');

const getVerify = async () => fetchApi('/verify');
const getToken = async code => fetchApi('/token', {
  qs: { code }
});

const getLogin = async token => fetchApi('/login', {
  qs: { token }
});
const getUser = async (login, token) =>
  fetchApi('/user', {
    qs: { login, token }
  });

const getUserRepos = async (login, token) =>
  fetchApi('/user/repos', {
    qs: { login, token }
  });
const getUserContributed = async (login, token) =>
  fetchApi('/user/contributed', {
    qs: { login, token }
  });
const getUserCommits = async (login, token) =>
  fetchApi('/user/commits', {
    qs: { login, token }
  });
const getUserOrgs = async (login, token) =>
  fetchApi('/user/orgs', {
    qs: { login, token }
  });

const getUpdateTime = async login =>
  fetchApi('/user/updateTime', {
    qs: { login }
  });

const refreshUserRepos = async (login, token) =>
  fetchApi('/user/repos/refresh', {
    qs: { login, token },
    timeouts: [null]
  });
const refreshUserCommits = async (login, token) =>
  fetchApi('/user/commits/refresh', {
    qs: { login, token },
    timeouts: [null]
  });
const refreshUserOrgs = async (login, token) =>
  fetchApi('/user/orgs/refresh', {
    qs: { login, token },
    timeouts: [null]
  });

export default {
  /* ===== */
  getZen,
  getOctocat,
  /* ===== */
  getVerify,
  getToken,
  getLogin,
  /* ===== */
  getUser,
  getUserRepos,
  getUserCommits,
  getUserOrgs,
  getUserContributed,
  getUpdateTime,
  refreshUserRepos,
  refreshUserCommits,
  refreshUserOrgs,
};

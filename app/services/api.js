import config from 'config';
import fetch from '../utils/fetch';

const appName = config.get('appName');


/* =========================== basic funcs =========================== */

const fetchApi = (url, options = {}) => {
  const {
    timeouts,
    qs = {},
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
  fetchApi(`/${login}`, {
    qs: { token }
  });

const getUserRepos = async (login, token) =>
  fetchApi(`/${login}/repositories`, {
    qs: { token }
  });
const getUserContributed = async (login, token) =>
  fetchApi(`/${login}/contributed`, {
    qs: { token }
  });
const getUserCommits = async (login, token) =>
  fetchApi(`/${login}/commits`, {
    qs: { token }
  });
const getUserOrgs = async (login, token) =>
  fetchApi(`/${login}/organizations`, {
    qs: { token }
  });

const getUpdateTime = async login =>
  fetchApi(`/${login}/updateTime`);

const refreshUserRepos = async (login, token) =>
  fetchApi(`/${login}/repositories/refresh`, {
    qs: { token },
    timeouts: [null]
  });
const refreshUserContributed = async (login, token) =>
  fetchApi(`/${login}/contributed/refresh`, {
    qs: { token },
    timeouts: [null]
  });
const refreshUserCommits = async (login, token) =>
  fetchApi(`/${login}/commits/refresh`, {
    qs: { token },
    timeouts: [null]
  });
const refreshUserOrgs = async (login, token) =>
  fetchApi(`/${login}/organizations/refresh`, {
    qs: { token },
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
  /* ===== */
  refreshUserRepos,
  refreshUserCommits,
  refreshUserOrgs,
  refreshUserContributed,
};

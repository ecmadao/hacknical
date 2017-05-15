import fetch from '../utils/fetch';
import config from 'config';

const appName = config.get('appName');


/* =========================== basic funcs =========================== */

const fetchApi = (url, headers = {}, timeouts) => {
  const options = {
    headers,
    url
  };
  return fetch.get(options, timeouts);
};

const postApi = (url, timeouts) => {
  const options = {
    url
  };
  return fetch.post(options, timeouts);
};

/* =========================== api funcs =========================== */

const getZen = async () => fetchApi('/zen', {
  'X-App-Name': appName
});
const getOctocat = async () => fetchApi('/octocat', {
  'X-App-Name': appName
});

const getVerify = async () => fetchApi('/verify', {
  'X-App-Name': appName
});
const getToken = async (code) => fetchApi(`/token?code=${code}`);

const getLogin = async (token) => fetchApi(`/login?token=${token}`);
const getUser = async (login, token) => fetchApi(`/user?login=${login}&token=${token}`);

const getUserRepos = async (login, token) => fetchApi(`/user/repos?login=${login}&token=${token}`);
const getUserCommits = async (login, token) => fetchApi(`/user/commits?login=${login}&token=${token}`);
const getUserOrgs = async (login, token) => fetchApi(`/user/orgs?login=${login}&token=${token}`);

const getUpdateTime = async (login) => fetchApi(`/user/updateTime?login=${login}`);

const refreshUserRepos = async (login, token) => fetchApi(
  `/user/repos/refresh?login=${login}&token=${token}`,
  {},
  [null]
);
const refreshUserCommits = async (login, token) => fetchApi(
  `/user/commits/refresh?login=${login}&token=${token}`,
  {},
  [null]
);
const refreshUserOrgs = async (login, token) => fetchApi(
  `/user/orgs/refresh?login=${login}&token=${token}`,
  {},
  [null]
);

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
  getUpdateTime,
  refreshUserRepos,
  refreshUserCommits,
  refreshUserOrgs
};

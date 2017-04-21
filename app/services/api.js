import config from 'config';
import fetch from '../utils/fetch';

const API_URL = config.get('services.api.url');
const APP_NAME = config.get('services.api.app');
const BASE_URL = `${API_URL}/api/github`;
const retryTimes = config.get('services.api.timeouts');

/* =========================== basic funcs =========================== */

const fetchApi = (url, headers = {}, timeout = retryTimes) => {
  const options = {
    url: `${BASE_URL}${url}`,
    headers: Object.assign({}, {
      'App-Name': APP_NAME
    }, headers)
  };
  return fetch.get(options, timeout);
};

const postApi = (url, timeout = retryTimes) => {
  const options = {
    url
  };
  return fetch.post(options, timeout);
};

/* =========================== api funcs =========================== */

const getZen = async () => fetchApi('/zen');
const getOctocat = async () => fetchApi('/octocat');

const getVerify = async () => {
  return fetchApi('/verify');
};

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
}

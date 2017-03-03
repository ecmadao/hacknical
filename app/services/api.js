import config from 'config';
import fetch from '../utils/fetch';

const API_URL = config.get('services.api.url');
const APP_NAME = config.get('services.api.app');
const BASE_URL = `${API_URL}/api/github`;

/* =========================== basic funcs =========================== */

const fetchApi = (url, headers = {}) => {
  const options = {
    url: `${BASE_URL}${url}`,
    headers
  };
  return fetch.get(options);
};

const postApi = (url) => {
  const options = {
    url
  };
  return fetch.post(options);
};

/* =========================== api funcs =========================== */

const getZen = async () => fetchApi('/zen');
const getOctocat = async () => fetchApi('/octocat');

const getVerify = async () => {
  return fetchApi('/verify', {
    'User-Agent': APP_NAME
  });
};

const getToken = async (code) => fetchApi(`/token?code=${code}`);

const getLogin = async (token) => fetchApi(`/login?token=${token}`);

const getUser = async (login, token) => fetchApi(`/user?login=${login}&token=${token}`);

const getUserDatas = async (login, token) => fetchApi(`/userDatas?login=${login}&token=${token}`);
const getUserOrgs = async (login, token) => fetchApi(`/userDatas/orgs?login=${login}&token=${token}`);

const getUpdateTime = async (login) => fetchApi(`/userDatas/updateTime?login=${login}`);
const refreshUserDatas = async (login, token) => fetchApi(`/userDatas/refresh?login=${login}&token=${token}`);

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
  getUserDatas,
  getUserOrgs,
  getUpdateTime,
  refreshUserDatas
}

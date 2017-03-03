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

const getVerify = async () => {
  return fetchApi('/verify', {
    'User-Agent': APP_NAME
  });
};

const getToken = async (code) => {
  return fetchApi(`/token?code=${code}`);
};

const getLogin = async (token) => {
  return fetchApi(`/login?token=${token}`);
};

const getUser = async (login, token) => {
  return fetchApi(`/user?login=${login}&token=${token}`);
};

const getUserDatas = async (login, token) => {
  return fetchApi(`/userDatas?login=${login}&token=${token}`);
};

const getZen = async () => fetchApi('/zen');
const getOctocat = async () => fetchApi('/octocat');

export default {
  getVerify,
  getToken,
  getLogin,
  getUser,
  getUserDatas,
  getZen,
  getOctocat
}

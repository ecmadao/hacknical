
import config from 'config';
import fetch from '../utils/fetch';

const appName = config.get('appName');
const SERVICE = config.get('services.github');
const API_URL = SERVICE.url;
const TIMEOUTS = SERVICE.timeouts;
const BASE_GITHUB_URL = `${API_URL}/api/github`;
const BASE_SCIENTIFIC_URL = `${API_URL}/api/scientific`;

/* =========================== basic funcs =========================== */


const fetchApi = (url, options = {}) => {
  const {
    body,
    qs = {},
    headers = {},
    method = 'get',
    timeouts = TIMEOUTS,
    baseUrl = BASE_GITHUB_URL
  } = options;
  headers['X-App-Name'] = appName;
  return fetch[method]({
    qs,
    body,
    headers,
    source: 'github',
    url: `${baseUrl}${url}`,
  }, timeouts);
};

/* =========================== api funcs =========================== */

const getZen = token => fetchApi('/zen', {
  qs: { token }
});
const getOctocat = () => fetchApi('/octocat');

const getVerify = () => fetchApi('/verify');
const getToken = code => fetchApi('/token', {
  qs: { code }
});

const getLogin = token => fetchApi('/login', {
  qs: { token }
});
const getUser = (login, token) =>
  fetchApi(`/${login}`, {
    qs: { token }
  });

const getUserRepositories = (login, token) =>
  fetchApi(`/${login}/repositories`, {
    qs: { token }
  });
const getUserContributed = (login, token) =>
  fetchApi(`/${login}/contributed`, {
    qs: { token }
  });
const getUserCommits = (login, token) =>
  fetchApi(`/${login}/commits`, {
    qs: { token }
  });
const getUserOrganizations = (login, token) =>
  fetchApi(`/${login}/organizations`, {
    qs: { token }
  });

const getUpdateStatus = login =>
  fetchApi(`/${login}/update/status`);

const updateUserData = (login, token) =>
  fetchApi(`/${login}/update`, {
    method: 'put',
    body: { token },
    timeouts: [null]
  });

const getHotmap = (login, locale) =>
  fetchApi(`/${login}/hotmap`, {
    qs: { locale }
  });

const getUserStatistic = (login, token) =>
  fetchApi(`/${login}/statistic`, {
    qs: { token },
    baseUrl: BASE_SCIENTIFIC_URL,
  });

const getUserPredictions = (login, token) =>
  fetchApi(`/${login}/predictions`, {
    qs: { token },
    baseUrl: BASE_SCIENTIFIC_URL,
  });

const removePrediction = (login, fullName) =>
  fetchApi(`/${login}/predictions`, {
    baseUrl: BASE_SCIENTIFIC_URL,
    method: 'delete',
    body: {
      fullName,
    }
  });

const putPredictionsFeedback = (login, fullName, liked) =>
  fetchApi(`/${login}/predictions`, {
    baseUrl: BASE_SCIENTIFIC_URL,
    method: 'put',
    body: {
      liked,
      fullName,
    }
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
  getUserRepositories,
  getUserCommits,
  getUserOrganizations,
  getUserContributed,
  /* ===== */
  getUpdateStatus,
  updateUserData,
  /* ===== */
  getHotmap,
  /* ===== */
  getUserStatistic,
  getUserPredictions,
  removePrediction,
  putPredictionsFeedback,
};

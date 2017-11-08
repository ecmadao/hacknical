import config from 'config';
import fetch from '../utils/fetch';

const appName = config.get('appName');
const API_URL = config.get('services.api.url');
const BASE_GITHUB_URL = `${API_URL}/api/github`;
const BASE_SCIENTIFIC_URL = `${API_URL}/api/scientific`;

/* =========================== basic funcs =========================== */


const fetchApi = (url, options = {}) => {
  const {
    body,
    timeouts,
    qs = {},
    headers = {},
    method = 'get',
    baseUrl = BASE_GITHUB_URL
  } = options;
  headers['X-App-Name'] = appName;
  return fetch[method]({
    qs,
    body,
    headers,
    url: `${baseUrl}${url}`,
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

const getUserRepositories = async (login, token) =>
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
const getUserOrganizations = async (login, token) =>
  fetchApi(`/${login}/organizations`, {
    qs: { token }
  });

const getUpdateTime = async login =>
  fetchApi(`/${login}/updateTime`);

const refreshUser = async (login, token) =>
  fetchApi(`/${login}/refresh`, {
    qs: { token },
    timeouts: [null]
  });
const refreshRepositories = async (login, token) =>
  fetchApi(`/${login}/repositories/refresh`, {
    qs: { token },
    timeouts: [null]
  });
const refreshContributed = async (login, token) =>
  fetchApi(`/${login}/contributed/refresh`, {
    qs: { token },
    timeouts: [null]
  });
const refreshCommits = async (login, token) =>
  fetchApi(`/${login}/commits/refresh`, {
    qs: { token },
    timeouts: [null]
  });
const refreshOrganizations = async (login, token) =>
  fetchApi(`/${login}/organizations/refresh`, {
    qs: { token },
    timeouts: [null]
  });

const getCalendar = async (login, locale) =>
  fetchApi(`/${login}/calendar`, {
    qs: { locale }
  });

const getUserStatistic = async (login, token) =>
  fetchApi(`/${login}/statistic`, {
    qs: { token },
    baseUrl: BASE_SCIENTIFIC_URL,
  });

const getUserPredictions = async (login, token) =>
  fetchApi(`/${login}/predictions`, {
    qs: { token },
    baseUrl: BASE_SCIENTIFIC_URL,
  });

const removePrediction = async (login, fullName) =>
  fetchApi(`/${login}/predictions`, {
    baseUrl: BASE_SCIENTIFIC_URL,
    method: 'delete',
    body: {
      fullName,
    }
  });

const putPredictionsFeedback = async (login, fullName, liked) =>
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
  getUpdateTime,
  /* ===== */
  refreshUser,
  refreshRepositories,
  refreshCommits,
  refreshOrganizations,
  refreshContributed,
  /* ===== */
  getCalendar,
  /* ===== */
  getUserStatistic,
  getUserPredictions,
  removePrediction,
  putPredictionsFeedback,
};

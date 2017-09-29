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

const getUserScientific = async (login, token) =>
  fetchApi(`/${login}/scientific`, {
    qs: { token }
  });

const getUserPredictions = async (login, token) =>
  fetchApi(`/${login}/predictions`, {
    qs: { token }
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
  getUserScientific,
  getUserPredictions,
  getUpdateTime,
  /* ===== */
  refreshRepositories,
  refreshCommits,
  refreshOrganizations,
  refreshContributed,
  /* ===== */
  getCalendar,
};

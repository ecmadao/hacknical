
import config from 'config';
import fetch from '../utils/fetch';

const appName = config.get('appName');
const SERVICE = config.get('services.user');
const API_URL = SERVICE.url;
const TIMEOUTS = SERVICE.timeouts;
const BASE_USER_URL = `${API_URL}/api/user`;
const BASE_RESUME_URL = `${API_URL}/api/resume`;

const fetchApi = (url = '', options = {}) => {
  const {
    body,
    qs = {},
    headers = {},
    method = 'get',
    timeouts = TIMEOUTS,
    baseUrl = BASE_USER_URL
  } = options;
  headers['X-App-Name'] = appName;
  return fetch[method]({
    qs,
    body,
    headers,
    source: 'user',
    url: `${baseUrl}${url}`,
  }, timeouts);
};

const getUser = qs => fetchApi('', { qs });

const createUser = data =>
  fetchApi('', {
    body: { data },
    method: 'post'
  });

const updateUser = (userId, data) =>
  fetchApi('', {
    body: {
      data,
      userId
    },
    method: 'put'
  });

const getUserCount = () => fetchApi('/count');

/* =========================================================== */

const getResume = qs =>
  fetchApi('', {
    qs,
    baseUrl: BASE_RESUME_URL
  });

const updateResume = ({ userId, login, resume }) =>
  fetchApi('', {
    body: {
      login,
      resume,
      userId,
    },
    method: 'put',
    baseUrl: BASE_RESUME_URL
  });

const getResumeInfo = qs =>
  fetchApi('/information', {
    qs,
    baseUrl: BASE_RESUME_URL
  });

const setResumeInfo = ({ userId, login, info }) =>
  fetchApi('/information', {
    body: {
      info,
      login,
      userId
    },
    method: 'put',
    baseUrl: BASE_RESUME_URL
  });

const getResumeCount = () => fetchApi('/count', {
  baseUrl: BASE_RESUME_URL
});

export default {
  /* ===== user ===== */
  getUser,
  updateUser,
  createUser,
  getUserCount,
  /* ===== resume ===== */
  getResume,
  updateResume,
  getResumeCount,
  /* ===== resume info ===== */
  getResumeInfo,
  setResumeInfo,
};

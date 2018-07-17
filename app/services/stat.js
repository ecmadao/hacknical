
import config from 'config';
import fetch from '../utils/fetch';
import cache from '../utils/cache';

const appName = config.get('appName');
const SERVICE = config.get('services.stat');
const API_URL = SERVICE.url;
const TIMEOUTS = SERVICE.timeouts;
const BASE_RECORDS_URL = `${API_URL}/api/records`;
const BASE_STAT_URL = `${API_URL}/api/stat`;
const BASE_NOTIFY_URL = `${API_URL}/api/notify`;

const fetchApi = (url = '', options = {}) => {
  const {
    body,
    qs = {},
    headers = {},
    method = 'get',
    timeouts = TIMEOUTS,
    baseUrl = BASE_RECORDS_URL
  } = options;
  headers['X-App-Name'] = appName;
  return fetch[method]({
    qs,
    body,
    headers,
    source: 'stat',
    url: `${baseUrl}${url}`,
  }, timeouts);
};

const TTL = 600; // 10 min
const getFromCache = cache.wrapFn(
  fetchApi, 'hacknical-stat', { ttl: TTL }
);

const getRecords = qs => getFromCache('', { qs });

const getAllRecords = () => getFromCache('/all');

const putRecords = data =>
  fetchApi('', {
    body: { data },
    method: 'put'
  });


const getStat = qs =>
  getFromCache('', {
    qs,
    baseUrl: BASE_STAT_URL
  });

const putStat = data =>
  fetchApi('', {
    body: { data },
    method: 'put',
    baseUrl: BASE_STAT_URL
  });

const getNotifies = locale =>
  getFromCache(`${BASE_NOTIFY_URL}/all`, { locale });

const getUnreadNotifies = (userId, locale) =>
  getFromCache(`${BASE_NOTIFY_URL}/${userId}`, { locale });

const markNotifies = (userId, ids) =>
  fetchApi(`${BASE_NOTIFY_URL}/${userId}`, {
    method: 'put',
    body: { ids }
  });

export default {
  /* ===== records ===== */
  getRecords,
  putRecords,
  getAllRecords,

  /* ===== stat ===== */
  getStat,
  putStat,

  /* ===== notify ===== */
  getNotifies,
  markNotifies,
  getUnreadNotifies
};

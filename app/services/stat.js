
import config from 'config';
import fetch from '../utils/fetch';
import cache from '../utils/cache';

const appName = config.get('appName');
const SERVICE = config.get('services.stat');
const API_URL = SERVICE.url;
const TIMEOUTS = SERVICE.timeouts;
const BASE_RECORDS_URL = `${API_URL}/api/records`;
const BASE_STAT_URL = `${API_URL}/api/stat`;

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

export default {
  /* ===== records ===== */
  getRecords,
  putRecords,
  getAllRecords,

  /* ===== stat ===== */
  getStat,
  putStat,
};

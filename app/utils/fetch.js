import request from 'request';
import config from 'config';
import logger from './logger';
import getSignature from './signature';

const auth = config.get('auth');
const name = config.get('appName');
const API_URL = config.get('services.api.url');
const retryTimes = config.get('services.api.timeouts');
const REQUEST_JSON_METHODS = ['PUT', 'POST', 'DELETE'];
const BASE_URL = `${API_URL}/api/github`;

const verify = (options = {}, appName = name) => {
  if (!options.headers) options.headers = {};
  const { body } = options;
  const date = new Date().toString();
  options.headers['Date'] = date;
  options.headers['X-App-Name'] = appName;
  options.json = true;
  options.url = `${BASE_URL}${options.url}`;

  try {
    const { secretKey, publicKey } = auth;
    let contentType = '';
    if (REQUEST_JSON_METHODS.find(method => method === options.method)) {
      contentType = 'application/json';
      options.headers['Content-Type'] = contentType;
    }
    const signature = getSignature({
      ...options,
      date,
      secretKey,
      contentType,
      body: body ? JSON.stringify(body) : ''
    });
    options.headers['Authorization'] = `Bearer ${publicKey}:${signature}`;
  } catch (e) {
    logger.error(e);
  }
};

const fetchData = (options) => {
  return new Promise((resolve, reject) => {
    request(options, (err, httpResponse, body) => {
      if (err) {
        reject(err);
      }
      if (body) {
        resolve(body.success ? body.result : false);
      }
      reject(err);
    });
  });
};

const fetch = async (options, timeouts = retryTimes) => {
  verify(options);

  let err = null;
  for (let i = 0; i < timeouts.length; i++) {
    try {
      const time = timeouts[i];
      if (time) {
        options.timeout = time;
      }
      const result = await fetchData(options);
      err = null;
      return result;
    } catch (e) {
      err = e;
    }
  }
  if (err) { throw new Error(err); }
};

export default {
  get: (options, timeouts) => {
    options.method = 'GET';
    return fetch(options, timeouts)
  },
  post: (options, timeouts) => {
    options.method = 'POST';
    return fetch(options, timeouts)
  }
};

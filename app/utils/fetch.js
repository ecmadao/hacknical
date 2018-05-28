import request from 'request';
import config from 'config';
import logger from './logger';
import getSignature from './signature';

const name = config.get('appName');
const REQUEST_JSON_METHODS = ['PUT', 'POST', 'DELETE', 'PATCH'];

const verify = (options = {}, appName = name) => {
  if (!options.headers) options.headers = {};
  const { body } = options;
  const date = new Date().toString();
  options.headers.Date = date;
  options.headers['X-App-Name'] = appName;
  options.json = true;

  try {
    const auth = config.get(`services.${options.source}.auth`);
    delete options.source;
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
    options.headers.Authorization = `Bearer ${publicKey}:${signature}`;
  } catch (e) {
    logger.error(e);
  }
};

const fetchData = options => new Promise((resolve, reject) => {
  request(options, (err, httpResponse, body) => {
    if (err) {
      reject(err);
    }
    if (body) {
      resolve(body.result);
    }
    reject(new Error(`Unknown Error when fetch: ${JSON.stringify(options)}`));
  });
});

const fetch = async (options, timeouts = [2000]) => {
  verify(options);

  let err = null;
  for (let i = 0; i < timeouts.length; i += 1) {
    try {
      const time = timeouts[i];
      if (time) {
        options.timeout = time;
      }
      logger.info(`[FETCH:START] ${JSON.stringify(options)}`);
      const result = await fetchData(options);
      err = null;
      return result;
    } catch (e) {
      err = e;
    }
  }
  if (err) {
    logger.error(err);
    throw new Error(err);
  }
};

export default {
  get: (options, timeouts) => {
    options.method = 'GET';
    return fetch(options, timeouts);
  },
  post: (options, timeouts) => {
    options.method = 'POST';
    return fetch(options, timeouts);
  },
  put: (options, timeouts) => {
    options.method = 'PUT';
    return fetch(options, timeouts);
  },
  delete: (options, timeouts) => {
    options.method = 'DELETE';
    return fetch(options, timeouts);
  },
  patch: (options, timeouts) => {
    options.method = 'PATCH';
    return fetch(options, timeouts);
  },
};

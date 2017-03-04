import request from 'request';
import config from 'config';

const retryTimes = config.get('services.api.timeouts');

const fetchData = (options, parse = true) => {
  return new Promise((resolve, reject) => {
    request(options, (err, httpResponse, body) => {
      if (err) {
        reject(err);
      }
      if (body) {
        const results = JSON.parse(body);
        resolve(results.success ? results.result : false);
      }
      reject(err);
    });
  });
};

const fetch = async (options, parse = true, timeout = retryTimes) => {
  let err = null;
  for (let i = 0; i < timeout.length; i++) {
    try {
      options.timeout = timeout[i];
      const result = await fetchData(options, parse);
      err = null;
      return result;
    } catch (e) {
      err = e;
    }
  }
  if (err) { throw new Error(err) }
};

export default {
  get: (options, parse, timeout) => {
    options.method = 'GET';
    return fetch(options, parse, timeout)
  },
  post: (options, parse, timeout) => {
    options.method = 'POST';
    return fetch(options, parse, timeout)
  }
}

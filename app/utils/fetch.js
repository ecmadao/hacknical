import request from 'request';

const retryTimes = [3000, 3000, 3000];

const fetchData = (options, parse = false) => {
  return new Promise((resolve, reject) => {
    request(options, (err, httpResponse, body) => {
      if (err) {
        reject(false);
      }
      if (body) {
        const result = parse ? JSON.parse(body) : body;
        resolve(result);
      }
      reject(false);
    });
  });
};

const fetch = async (options, parse = false, timeout = retryTimes) => {
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

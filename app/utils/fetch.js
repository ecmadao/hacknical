import request from 'request';

const fetchData = (options) => {
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

const fetch = async (options, timeout) => {
  console.log(timeout)
  let err = null;
  for (let i = 0; i < timeout.length; i++) {
    try {
      const time = timeout[i];
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
  console.log(err);
  if (err) { throw new Error(err) }
};

export default {
  get: (options, timeout) => {
    options.method = 'GET';
    return fetch(options, timeout)
  },
  post: (options, timeout) => {
    options.method = 'POST';
    return fetch(options, timeout)
  }
}

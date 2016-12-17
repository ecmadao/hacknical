import { polyfill } from 'es6-promise';
import param from 'jquery-param';
import 'isomorphic-fetch';

polyfill();
const rnoContent = /^(?:GET|HEAD)$/;

const fetchApi = (url, method, data) => {
  const options = {
    method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json,text/plain,*/*',
    },
  };
  if (rnoContent.test(method)) {
    const query = param(data);
    if (query) {
      url = url + (/\?/.test(url) ? '&' : '?') + query;
    }
  } else if (data) {
    options.body = JSON.stringify(data);
  }

  return fetch(url, options)
    .then(response => response.json())
    .then((json) => {
      if (!json.success) {
        throw new Error('Request Server Error');
      }
      // if (json.url) {
      //   window.location = json.url;
      // }
      // if (json.message) {
      //   Message.show(json.message, 1500);
      // }
      return json.result || false;
    }).catch((ex) => {
      throw new Error('Request Parsing Error', ex);
    });
};

export const postData = (url, data) => {
  return fetchApi(url, 'POST', data);
};

export const getData = (url, data) => {
  return fetchApi(url, 'GET', data);
};

export const deleteData = (url, data) => {
  return fetchApi(url, 'DELETE', data);
};

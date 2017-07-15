/* eslint no-param-reassign: "off" */

import { polyfill } from 'es6-promise';
import param from 'jquery-param';
import 'isomorphic-fetch';
import NProgress from 'nprogress';
import { Message } from 'light-ui/lib/raw';

require('nprogress/nprogress.css');

polyfill();
const rnoContent = /^(?:GET|HEAD)$/;
const message = new Message();

const fetchApi = (url, method, data) => {
  NProgress.start();
  NProgress.set(0.4);
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
    options.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json,text/plain,*/*'
    };
  }

  return fetch(url, options)
    .then(response => response.json())
    .then((json) => {
      if (!json.success) {
        throw new Error('Request Server Error');
      }
      if (json.message) {
        message.notice(json.message);
      }
      if (json.error) {
        message.error(json.error);
      }
      if (json.url) {
        window.location = json.url;
      }
      NProgress.done();
      return json.result || null;
    }).catch((ex) => {
      NProgress.done();
      throw new Error('Request Parsing Error', ex);
    });
};

const getCsrf = (resolve) => {
  const csrf = document.getElementsByTagName('meta')['csrf-token'].content;
  return resolve && resolve(csrf);
};

const verifyToFetch = (url, method, data) => (csrf) => {
  data._csrf = csrf;
  return fetchApi(url, method, data);
};

export const postData = (url, data = {}) =>
  getCsrf(verifyToFetch(url, 'POST', data));

export const getData = (url, data = {}) =>
  fetchApi(url, 'GET', data);

export const deleteData = (url, data = {}) =>
  getCsrf(verifyToFetch(url, 'DELETE', data));

export const putData = (url, data = {}) =>
  getCsrf(verifyToFetch(url, 'PUT', data));

export const patchData = (url, data = {}) =>
  getCsrf(verifyToFetch(url, 'PATCH', data));

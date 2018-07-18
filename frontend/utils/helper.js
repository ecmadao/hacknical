/* eslint arrow-body-style: "off", react/no-array-index-key: "off" */

import React from 'react';
import validator from 'validator';
import dateHelper from './date';
import { formatUrl, formatTextWithUrl } from './formatter';

const getSeconds = dateHelper.seconds.getByDate;

/*
 * example:
 *
 * array = [1, 2, 3, 4, 5]
 *       ===> 4
 *
 * array = [{a: 1}, {a: 3}, {a: 2}], key = a
 *       ===> 1
 */
export const getMaxIndex = (array, key = null) => {
  let max = 0;
  let maxIndex = 0;
  array.forEach((item, index) => {
    const target = key ? parseInt(item[key], 10) : parseInt(item, 10);
    if (max < target) {
      max = target;
      maxIndex = index;
    }
  });
  return maxIndex;
};

/**
 * [getMaxTarget description]
 * @method getMaxTarget
 * @param  {[Array]}        array      [description]
 * @param  {[function]}     [ func = item => [item] ] [description]
 * @return {[Array]}        [ maxResult, maxResultIndex ]
 *
 * example:
 * array = [
 *  [1, 2, 3, 4, 6]
 *  [8, 3, 1, 2, 5]
 *  [11, 54, 0]
 *  [9, 19]
 * ]
 * return [54, 2] ==> max reuslt is 54
 */
export const getMaxTarget = (array, func = item => [item]) => {
  let resultIndex = 0;
  let result = 0;

  for (const item of array) {
    const target = func(item);
    const currentMaxIndex = getMaxIndex(target);
    const currentMax = parseInt(target[currentMaxIndex], 10);
    if (result < currentMax) {
      result = currentMax;
      resultIndex = currentMaxIndex;
    }
  }
  return [result, resultIndex];
};

export const getFirstMatchTarget = (array, target) => {
  let index = 0;
  let result = array[index];

  for (let i = 0; i < array.length; i += 1) {
    const item = array[i];
    if (typeof target === 'object') {
      const check = Object.keys(target).every(key => item[key] === target[key]);
      if (check) {
        result = item;
        index = i;
        break;
      }
    } else if (typeof target === 'function') {
      if (target(item)) {
        result = item;
        index = i;
        break;
      }
    } else if (item === target) {
      result = item;
      index = i;
      break;
    }
  }
  return [result, index];
};

export const getFirstMatchIndex = (array, target) => {
  let index = 0;

  for (let i = 0; i < array.length; i += 1) {
    const item = array[i];
    if (typeof target === 'object') {
      const check = Object.keys(target).every(key => item[key] === target[key]);
      if (check) {
        index = i;
        break;
      }
    } else if (typeof target === 'function') {
      if (target(item)) {
        index = i;
        break;
      }
    } else if (item === target) {
      index = i;
      break;
    }
  }
  return index;
};

export const getOffsetLeft = (start, end) => (left) => {
  const length = end - start;
  return `${Math.floor(((left - start) * 100) / length)}%`;
};

export const getOffsetRight = (start, end) => (right) => {
  const length = end - start;
  return `${Math.floor(((end - right) * 100) / length)}%`;
};

export const sortBySeconds = key =>
  (thisObj, nextObj) =>
    getSeconds(thisObj[key]) - getSeconds(nextObj[key]);

/*
 * example:
 *
 * array = [1, 2, 3, 4]
 *       ===> [1, 2, 3, 4]
 *
 * array = [[1, 2, 3], [4, 5, 6]]
 *       ===> [1, 2, 3, 4, 5, 6]
 *
 * array = [{a: 1}, {a: 2}, {a: 3}], key = a
 *       ===> [1, 2, 3]
 */
export const faltten = (array, key = null) => {
  const result = [];

  for (const item of array) {
    if (Array.isArray(item)) {
      result.concat(item);
    } else {
      result.push(key ? item[key] : item);
    }
  }
  return result
};

/*
 * get: array => [1, 2, 3, 4, 5, 6], size => 2
 * return [[1, 2], [3, 4], [5, 6]]
 */
export const splitArray = (array, size = 1) => {
  const len = array.length;
  if (len <= size) {
    return [array];
  }
  const loop = Math.floor(len / size) + 1;
  return Array
    .from(new Array(loop), () => 0)
    .map((i, index) => array.slice(index * size, (index + 1) * size));
};

const URL_REG =
  /(https|http|ftp|rtsp|mms)?:\/\/([a-z0-9]\.|[a-z0-9][-a-z0-9]{0,61}[a-z0-9])(com|edu|gov|int|mil|net|org|biz|info|name|museum|coop|aero|[a-z][a-z])*/i;

export const isUrl = value => validator.isURL(value);

export const hasUrl = text => URL_REG.test(text);

export const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

export const removeDOM = (dom, options = {}) => {
  const { async = false, timeout = 1000 } = options;
  if (async) {
    setTimeout(() => removeDOM(dom), timeout);
  } else {
    $(dom) && $(dom).remove();
  }
};

export const renderTextWithUrl = (text) => {
  return formatTextWithUrl(text).map((section, index) => {
    const { type, value } = section;
    if (type === 'a' && isUrl(value)) {
      return (
        <a
          key={index}
          target="_blank"
          rel="noopener noreferrer"
          href={formatUrl(value)}
        >
          {value}
        </a>
      );
    }
    return (<span key={index}>{value}</span>);
  });
};

export const toPromise = f => (...args) =>
  new Promise((resolve, reject) => {
    const result = f(...args);
    try {
      return result.then(resolve, reject); // promise.
    } catch (e) {
      if (e instanceof TypeError) {
        resolve(result); // resolve naked value.
      } else {
        reject(e); // pass unhandled exception to caller.
      }
    }
  });

export const random = (list) => {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
};

export const observer = (action, options = {}) => {
  let timeout = null;
  const { interval = 3000 } = options;

  return dispatch => (...args) => {
    if (timeout) return;
    if (dispatch) {
      dispatch(action(...args));
    } else {
      action(...args);
    }
    timeout = setTimeout(() => {
      clearTimeout(timeout);
      timeout = null;
    }, interval);
  };
};

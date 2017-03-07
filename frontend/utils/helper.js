import dateHelper from './date';

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

  array.forEach((item, index) => {
    const target = func(item);
    const currentMaxIndex = getMaxIndex(target);
    const currentMax = parseInt(target[currentMaxIndex], 10);
    if (result < currentMax) {
      result = currentMax;
      resultIndex = currentMaxIndex;
    }
  });
  return [result, resultIndex];
};

export const getFirstMatchTarget = (array, target) => {
  let index = 0;
  let result = array[index];

  for(let i = 0; i < array.length; i++) {
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
    } else {
      if (item === target) {
        result = item;
        index = i;
        break;
      }
    }
  }
  return [result, index];
};

export const getFirstMatchIndex = (array, target) => {
  let index = 0;

  for(let i = 0; i < array.length; i++) {
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
    } else {
      if (item === target) {
        index = i;
        break;
      }
    }
  }
  return index;
};

export const sortRepos = (key = 'stargazers_count', func = parseInt) => (firstRepos, secRepos) => {
  return func(secRepos[key]) - func(firstRepos[key]);
};

export const sortLanguages = (obj) => (firstLanguage, secLanguage) => {
  return obj[secLanguage] - obj[firstLanguage];
};

export const getOffsetLeft = (start, end) => (left) => {
  const length = end - start;
  return `${Math.floor((left - start) * 100 / length)}%`;
};

export const getOffsetRight = (start, end) => (right) => {
  const length = end - start;
  return `${Math.floor((end - right) * 100 / length)}%`;
};

export const sortBySeconds = (key) => (thisObj, nextObj) => getSeconds(thisObj[key]) - getSeconds(nextObj[key]);
export const sortByX = (key) => (thisObj, nextObj) => thisObj[key] - nextObj[key];

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
  array.forEach((item) => {
    if (Array.isArray(item)) {
      result.concat(item);
    } else {
      result.push(key ? item[key] : item);
    }
  });
  return result
};

/*
 * get: array => [1, 2, 3, 4, 5, 6], size => 2
 * return [[1, 2], [3, 4], [5, 6]]
 */
export const splitArray = (array, size = 1) => {
  const length = array.length;
  if (length <= size) {
    return [array];
  }
  const loop = Math.floor(length / size) + 1;
  return Array.from(new Array(5), (item, index) => 0).map((i, index) => {
    return array.slice(index * size, (index + 1) * size)
  });
};

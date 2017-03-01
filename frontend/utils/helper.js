import dateHelper from './date';

const getSeconds = dateHelper.seconds.getByDate;

export const getMaxIndex = (array, key = null) => {
  let max = 0;
  let maxIndex = 0;
  array.forEach((item, index) => {
    if (key) {
      if (max < item[key]) {
        max = item[key];
        maxIndex = index;
      }
    } else {
      if (max < item) {
        max = item;
        maxIndex = index;
      }
    }
  });
  return maxIndex;
};

export const getFirstTarget = (array, target) => {
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

export const sortByX = (key) => (thisObj, nextObj) => getSeconds(thisObj[key]) - getSeconds(nextObj[key]);

export const faltten = (array) => {
  const result = [];
  array.forEach((item) => {
    if (Array.isArray(item)) {
      result.concat(item);
    } else {
      result.push(item);
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

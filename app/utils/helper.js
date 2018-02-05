import pangu from 'pangu';

const { spacing } = pangu;

const checkType = (val, result) =>
  Object.prototype.toString.call(val) === result;

export const is = {
  object: val => checkType(val, '[object Object]'),
  array: val => Array.isArray(val),
  func: val => checkType(val, '[object Function]'),
  string: val => checkType(val, '[object String]'),
};

/* ======================= SORT ======================== */
const sortByX = (key, func = null) =>
  (first, second) => {
    if (func) {
      return func(second[key]) - func(first[key]);
    }
    return second[key] - first[key];
  };

export const sortBy = {
  x: sortByX,
  star: sortByX({ key: 'stargazers_count', func: parseInt }),
};

const reValueObject = (object, key) => (value) => { object[key] = value; };

const loopObject = (object) => {
  if (is.object(object)) {
    Object.keys(object).forEach((key) => {
      const value = object[key];
      formatString(value, reValueObject(object, key));
    });
  }

  if (is.array(object)) {
    object.forEach((item, index) => {
      formatString(item, reValueObject(object, index));
    });
  }
};

const formatString = (value, callback = null) => {
  if (is.string(value)) {
    const result = spacing(value);
    if (is.func(callback)) {
      callback(result)
    }
  } else {
    loopObject(value, spacing);
  }
};

export const formatObject = (object = {}) => {
  const result = Object.assign({}, object);
  formatString(result);
  return result;
};

/*
  * example:
  *
  * GET:
  * object = {
  *  a: 1,
  *  b: {
  *    c: 2
  *  }
  * }
  * KEY = 'b.c';
  *
  * RETURN: 2
 */
export const getValue = (object, key) => {
  const sections = key.split('.');
  let result = object;
  sections.forEach((section) => {
    result = result[section]
  });
  return result;
};

/**
 * [getPlanObject description]
 * @method getPlanObject
 * @param  {[Object]}       object [description]
 * @param  {[Array]}       keys   [get target value in object by keys]
 * @return {[Object]}              [return a new object combined by key-value]
 *
 * example:
 *
 * GET:
 * object = {
 *  a: 1,
 *  b: {
 *    c: 2
 *  }
 * }
 * array = ['a', 'b.c'];
 *
 * RETURN:
 * {
 *  a: 1,
 *  c: 2
 * }
 */
export const getPlanObject = (object, keys) => {
  const planObject = {};
  keys.forEach((key) => {
    const result = getValue(object, key);
    if (result !== object) {
      planObject[keys.slice(-1)[0]] = result;
    }
  });
  return planObject;
};

export const mergeObject = (targetObj, valObj) => {
  const keys = Object.keys(valObj);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const val = valObj[key];
    if (is.object(val)) {
      mergeObject(targetObj[key], val);
    } else {
      targetObj[key] = val
    }
  }
};

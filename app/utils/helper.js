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
const getValue = (object, key) => {
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
  keys.forEach((key, index) => {
    const result = getValue(object, key);
    if (result !== object) {
      planObject[sections.slice(-1)[0]] = result;
    }
  });
  return planObject;
};

export default getValue;


import pangu from 'pangu'

const { spacing } = pangu

const checkType = (val, result) =>
  Object.prototype.toString.call(val) === result

export const is = {
  object: val => checkType(val, '[object Object]'),
  array: val => Array.isArray(val),
  func: val => checkType(val, '[object Function]'),
  string: val => checkType(val, '[object String]')
}

/* ======================= SORT ======================== */
const sortByX = (key, func = null) =>
  (first, second) => {
    if (func) {
      return func(second[key]) - func(first[key])
    }
    return second[key] - first[key]
  }

export const sortBy = {
  x: sortByX,
  star: sortByX('stargazers_count', parseInt)
}

const reValueObject = (object, key) => (value) => { object[key] = value }

const loopObject = (object) => {
  if (is.object(object)) {
    for (const key of Object.keys(object)) {
      const value = object[key]
      formatString(value, reValueObject(object, key))
    }
  }

  if (is.array(object)) {
    object.forEach((item, index) => {
      formatString(item, reValueObject(object, index))
    })
  }
}

const formatString = (value, callback = null) => {
  if (is.string(value)) {
    const result = spacing(value)
    if (is.func(callback)) {
      callback(result)
    }
  } else {
    loopObject(value)
  }
}

export const formatObject = (object = {}) => {
  const result = Object.assign({}, object)
  formatString(result)
  return result
}

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
  const sections = key.split('.')
  let result = object
  for (const section of sections) {
    result = result[section]
  }
  return result
}

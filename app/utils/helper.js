
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
  * KEY = 'b.c'
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

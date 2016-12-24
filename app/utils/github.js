const SPLIT_NUM = 15;

/**
 * split array by max array length
 *
 * @example
 * get -> [1, 2, 3, 4, 5, 6, 7], 3
 * return -> [[1, 2, 3], [4, 5, 6], [7]]
 */

export const splitArray = (array, max = SPLIT_NUM) => {
  const arrayLength = array.length;
  if (arrayLength <= max) {
    return [array];
  }
  const loop = Math.floor(arrayLength / max) + 1;
  return new Array(loop).fill(0).map((i, index) => {
    return array.slice(index * max, (index + 1) * max)
  });
};

export const validateReposList = (repos) => {
  const reposList = repos.filter(repository => !repository.fork).map((repository) => {
    const { full_name, reposId } = repository;
    return {
      fullname: full_name,
      reposId
    }
  });
  return reposList
};

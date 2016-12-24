import dateHelper from './date';

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

export const getReposInYears = (repos, years = 1) => {
  const oneYearBefore = dateHelper.getDateBeforeYears(years);
  const seconds = dateHelper.getSeconds(oneYearBefore);
  return repos.filter(repository => dateHelper.getSeconds(repository.created_at) >= seconds);
};

export const validateReposList = (repos) => {
  const reposList = getReposInYears(repos).map((repository) => {
    const { name, full_name, reposId } = repository;
    return {
      name,
      reposId,
      fullname: full_name,
    }
  });
  return reposList
};

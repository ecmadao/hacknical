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
  return repos.filter((repository) => {
    return dateHelper.getSeconds(repository.created_at) >= seconds
  });
};

export const validateReposList = (repos) => {
  const reposList = getReposInYears(repos).filter(repository => !repository.fork).map((repository) => {
    const { name, full_name, reposId, created_at, pushed_at } = repository;
    return {
      name,
      reposId,
      pushed_at,
      created_at,
      fullname: full_name,
    }
  });
  return reposList
};

const sortCommits = (thisRepos, nextRepos) => {
  return nextRepos.totalCommits - thisRepos.totalCommits;
};

export const sortByCommits = (repos) => {
  return repos.sort(sortCommits);
};

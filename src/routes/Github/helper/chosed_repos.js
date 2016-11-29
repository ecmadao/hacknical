export const getMinDate = (repos) => {
  const createDates = repos.map(repository => new Date(repository['created_at']));
  return Math.min(...createDates);
};

export const getMaxDate = (repos) => {
  const pushDates = repos.map(repository => new Date(repository['pushed_at']));
  return Math.max(...pushDates);
};

const sortRepos = (thisRepos, nextRepos) => {
  return new Date(thisRepos['created_at']) - new Date(nextRepos['created_at']);
};

export const sortByDate = (repos) => {
  return repos.sort(sortByDate);
};

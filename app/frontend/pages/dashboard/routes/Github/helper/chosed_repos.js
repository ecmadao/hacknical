import moment from 'moment';
moment.locale('zh-cn');

export const getMinDate = (repos) => {
  const createDates = repos.map(repository => new Date(repository['created_at']));
  return moment(Math.min(...createDates)).format('l');
};

export const getMaxDate = (repos) => {
  const pushDates = repos.map(repository => new Date(repository['pushed_at']));
  return moment(Math.max(...pushDates)).format('l');
};

const sortRepos = (thisRepos, nextRepos) => {
  return new Date(thisRepos['created_at']) - new Date(nextRepos['created_at']);
};

export const sortByDate = (repos) => {
  return repos.sort(sortRepos);
};

export const getReposByIds = (repos, ids) => {
  return repos.filter(repository => ids.some(id => parseInt(id) === parseInt(repository.reposId)));
};

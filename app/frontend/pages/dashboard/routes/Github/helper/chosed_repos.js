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

export const getReposInfo = (commits, repos) => {
  return commits.map((commit, index) => {
    const { reposId } = commit;
    const targetRepos = repos.filter(repository => repository.reposId === reposId);
    if (!targetRepos.length) {
      return commit;
    }
    const {
      forks_count,
      language,
      stargazers_count,
      html_url
    } = targetRepos[0];
    commit['forks_count'] = forks_count;
    commit['language'] = language;
    commit['stargazers_count'] = stargazers_count;
    commit['html_url'] = html_url;
    return commit;
  });
};

import { sortRepos } from './helper';
import { getValidateFullDate } from './date';

const combineReposCommits = (reposCommits) => {
  const result = {
    commits: [],
    total: 0,
    dailyCommits: [
      // from sunday to monday
    ]
  };
  reposCommits.forEach((repository, repositoryIndex) => {
    repository.commits.forEach((commit, index) => {
      const { total, days, week } = commit;
      result.total += total;

      const targetCommit = result.commits[index];
      if (!targetCommit) {
        result.commits.push({
          total,
          days,
          week
        });
        days.forEach((day, i) => {
          result.dailyCommits[i] = day;
        });
        return;
      }

      targetCommit.total += total;
      days.forEach((day, i) => {
        targetCommit.days[i] += day;
        result.dailyCommits[i] += day;
      });
    });
  });
  return result;
};

const getReposNames = (repos) => {
  return repos.map(repository => repository.name);
};

const getReposForks = (repos) => {
  return repos.map(repository => repository['forks_count']);
};

const getReposStars = (repos) => {
  return repos.map(repository => repository['stargazers_count']);
};

const getLanguageDistribution = (repos) => {
  const reposLanguages = {};
  repos.forEach((repository) => {
    const { language } = repository;
    reposLanguages[language] = isNaN(reposLanguages[language]) ? 1 : reposLanguages[language] + 1;
  });
  return reposLanguages;
};

const getLanguageSkill = (repos) => {
  const reposLanguages = {};
  repos.forEach((repository) => {
    const { language, stargazers_count } = repository;
    reposLanguages[language] = isNaN(reposLanguages[language]) ? parseInt(stargazers_count) : reposLanguages[language] + parseInt(stargazers_count);
  });
  return reposLanguages;
};

const getReposLanguages = (repos) => {
  const languages = [];
  repos.forEach((repository) => {
    const { language } = repository;
    if (!languages.some(item => item === language)) {
      if (language) {
        languages.push(language);
      }
    }
  });
  return languages;
};

const getReposByLanguage = (repos, language) => {
  return repos.filter(repository => repository.language === language).sort(sortRepos('stargazers_count'));
};

const getMinDate = (repos) => {
  const createDates = repos.map(repository => new Date(repository['created_at']));
  return getValidateFullDate(Math.min(...createDates));
};

const getMaxDate = (repos) => {
  const pushDates = repos.map(repository => new Date(repository['pushed_at']));
  return getValidateFullDate(Math.max(...pushDates));
};

const sortByDate = (repos) => {
  return repos.sort(sortRepos('created_at'));
};

const getReposByIds = (repos, ids) => {
  return repos.filter(repository => ids.some(id => parseInt(id) === parseInt(repository.reposId)));
};

const getReposInfo = (commits, repos) => {
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

export default {
  getReposNames,
  getReposForks,
  getReposStars,
  getLanguageDistribution,
  getLanguageSkill,
  getReposLanguages,
  getReposByLanguage,
  combineReposCommits,
  getMinDate,
  getMaxDate,
  sortByDate,
  getReposByIds,
  getReposInfo
}

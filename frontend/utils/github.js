import { sortRepos } from './helper';
import dateHelper from './date';

const getFullDateBySecond = dateHelper.validator.fullDateBySeconds;
const getSecondsByDate = dateHelper.seconds.getByDate;
const baseUrl = 'https://github.com';

const getReposNames = repos =>
  repos.map(repository => repository.name);

const getReposForks = repos =>
  repos.map(repository => repository.forks_count);

const getReposStars = repos =>
  repos.map(repository => repository.stargazers_count);

const getLanguageDistribution = (repos) => {
  const reposLanguages = {};
  repos.forEach((repository) => {
    const { language } = repository;
    reposLanguages[language] = isNaN(reposLanguages[language])
      ? 1
      : reposLanguages[language] + 1;
  });
  return reposLanguages;
};

const getLanguageSkill = (repos) => {
  const reposLanguages = {};
  repos.forEach((repository) => {
    const { language, languages, stargazers_count } = repository;
    if (!languages) {
      reposLanguages[language] = isNaN(reposLanguages[language])
        ? parseInt(stargazers_count, 10)
        : reposLanguages[language] + parseInt(stargazers_count, 10);
      return;
    }
    Object.keys(languages).forEach((lang) => {
      if (reposLanguages[lang]) {
        reposLanguages[lang] += parseInt(stargazers_count, 10);
      } else {
        reposLanguages[lang] = parseInt(stargazers_count, 10);
      }
    });
  });
  return reposLanguages;
}

const getLanguageUsed = (repos) => {
  const result = {};
  repos.forEach((repository) => {
    const { languages } = repository;
    if (!languages) { return }
    Object.keys(languages).forEach((language) => {
      if (result[language]) {
        result[language] += languages[language];
      } else {
        result[language] = languages[language];
      }
    });
  });
  return result;
};

const getReposByLanguage = (repos, targetLanguage) => repos.filter((repository) => {
  const { languages, language } = repository;
  if (!languages) {
    return language === targetLanguage;
  }
  return Object.keys(languages).some(key => key === targetLanguage);
}).sort(sortRepos('stargazers_count'));

const getMinDate = (repos) => {
  const createDates = repos.map(
    repository => getSecondsByDate(repository.created_at)
  );
  return getFullDateBySecond(Math.min(...createDates));
};

const getMaxDate = (repos) => {
  const pushDates = repos.map(
    repository => getSecondsByDate(repository.pushed_at)
  );
  return getFullDateBySecond(Math.max(...pushDates));
};

const sortByDate = repos =>
  repos.sort(sortRepos('created_at', getSecondsByDate)).reverse();

const getReposByIds = (repos, ids) =>
  repos.filter(
    repository => ids.some(
      id => parseInt(id, 10) === parseInt(repository.reposId, 10)
    )
  );

const getReposInfo = (commits, repos) => commits.map((commit) => {
  const { reposId } = commit;
  const targetRepos = repos.filter(
    repository => repository.reposId === reposId);
  if (!targetRepos.length) {
    return commit;
  }
  const {
    forks_count,
    language,
    stargazers_count,
    html_url,
    full_name
  } = targetRepos[0];
  commit.forks_count = forks_count;
  commit.language = language;
  commit.stargazers_count = stargazers_count;
  commit.html_url = html_url;
  commit.full_name = full_name;
  return commit;
});

const getReposCommits = (repos, commits) => repos.map((repository) => {
  const targetRepos = commits.filter(
    commit => commit.reposId === repository.reposId);
  if (targetRepos.length) {
    return targetRepos[0].totalCommits;
  }
  return 0;
});

const getTotalCount = (repos) => {
  let totalStar = 0;
  let totalFork = 0;
  repos.forEach((repository) => {
    totalStar += repository.stargazers_count;
    totalFork += repository.forks_count;
  });
  return [totalStar, totalFork]
};

const getYearlyRepos = (repos) => {
  const yearAgoSeconds = dateHelper.seconds.beforeYears(1);
  return repos.filter(
    repository => !repository.fork && getSecondsByDate(repository.created_at) > yearAgoSeconds
  );
};

// private
const getMaxObject = (array, callback) => {
  let max = {};
  array.forEach((item, index) => {
    if (index === 0 || (index !== 0 && callback(item, max))) {
      max = item;
      max.persistTime =
        getSecondsByDate(item.pushed_at) - getSecondsByDate(item.created_at);
    }
  });
  return max;
};

const longestContributeRepos = repos => getMaxObject(repos, (currentRepos, maxRepos) => {
  const currentPresist =
    getSecondsByDate(currentRepos.pushed_at) - getSecondsByDate(currentRepos.created_at);
  return currentPresist > maxRepos.persistTime;
});

export default {
  baseUrl,
  getReposNames,
  getReposForks,
  getReposStars,
  getLanguageDistribution,
  getLanguageSkill,
  getLanguageUsed,
  getReposByLanguage,
  getMinDate,
  getMaxDate,
  sortByDate,
  getReposByIds,
  getReposInfo,
  getReposCommits,
  getTotalCount,
  getYearlyRepos,
  longestContributeRepos
};

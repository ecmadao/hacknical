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

  for (const repository of repos) {
    const { language } = repository;
    reposLanguages[language] = Number.isNaN(reposLanguages[language])
      ? 1
      : reposLanguages[language] + 1;
  }
  return reposLanguages;
};

const getLanguageSkill = (repos) => {
  const reposLanguages = {};

  for (const repository of repos) {
    const { language, languages, stargazers_count } = repository;
    if (!languages) {
      reposLanguages[language] = Number.isNaN(reposLanguages[language])
        ? parseInt(stargazers_count, 10)
        : reposLanguages[language] + parseInt(stargazers_count, 10);
      continue;
    }

    for (const lang of Object.keys(languages)) {
      if (reposLanguages[lang]) {
        reposLanguages[lang] += parseInt(stargazers_count, 10);
      } else {
        reposLanguages[lang] = parseInt(stargazers_count, 10);
      }
    }
  }
  return reposLanguages;
}

const getLanguageUsed = (repos) => {
  const result = {};

  for (const repository of repos) {
    const { languages } = repository;
    if (!languages) continue;

    for (const language of Object.keys(languages)) {
      if (result[language]) {
        result[language] += languages[language];
      } else {
        result[language] = languages[language];
      }
    }
  }
  return result;
};

const getReposByLanguage = (repos, targetLanguage) => {
  const filtered = repos.filter((repository) => {
    const { languages, language } = repository;
    if (!languages) {
      return language === targetLanguage;
    }
    return Object.keys(languages).some(key => key === targetLanguage);
  });
  return filtered;
};

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

const getDateInterval = (key1, key2) => repos =>
  Math.abs(getSecondsByDate(repos[key1]) - getSecondsByDate(repos[key2]));

const sortByX = ({ key = null, func = null, ascending = false }) =>
  (first, second) => {
    const itemF = key ? first[key] : first;
    const itemS = key ? second[key] : second;
    const rank = ascending ? 1 : -1;
    if (func) {
      return rank * (func(itemF) - func(itemS));
    }
    return rank * (itemF - itemS);
  };

const sortByDate = (repos, key = 'created_at') =>
  repos.sort(sortByX({ key, func: getSecondsByDate })).reverse();

const sortByLanguage = obj =>
  (firstLanguage, secLanguage) =>
    obj[secLanguage] - obj[firstLanguage];

const getReposByX = x => (repos, items) =>
  repos.filter(
    repository => items.some(
      item => item === repository[x]
    )
  );

const getReposInfo = (commits, repos) => commits.map((commit) => {
  const { name } = commit;
  const targetRepos = repos.filter(
    repository => repository.name === name
  );
  if (!targetRepos.length) return commit;

  const {
    language,
    html_url,
    full_name,
    forks_count,
    stargazers_count,
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
    commit => commit.name === repository.name);
  if (targetRepos.length) {
    return targetRepos[0].totalCommits;
  }
  return 0;
});

const getTotalCount = (repos) => {
  const tmp = repos.reduce((pre, repository) => {
    pre.totalStar += repository.stargazers_count;
    pre.totalFork += repository.forks_count;
    return pre;
  }, {
    totalStar: 0,
    totalFork: 0,
  });

  return [tmp.totalStar, tmp.totalFork];
};

const getCreatedRepos = repos =>
  repos.filter(repository => !repository.fork);

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
  getDateInterval,
  /* sort */
  sortByX,
  sortByDate,
  sortByLanguage,
  /* ================== */
  getReposByX,
  getReposInfo,
  getReposCommits,
  getTotalCount,
  getYearlyRepos,
  getCreatedRepos,
  longestContributeRepos
};

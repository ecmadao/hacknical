import { sortRepos } from './helper';
import dateHelper from './date';

const getFullDateBySecond = dateHelper.validator.fullDateBySeconds;
const getSecondsByDate = dateHelper.seconds.getByDate;
const getMonth = dateHelper.date.getMonth;
const getDateBySeconds = dateHelper.date.bySeconds;
const baseUrl = 'https://github.com';
const BASE_DAYS = [0, 0, 0, 0, 0, 0, 0];

const combineReposCommits = (reposCommits) => {
  const result = {
    commits: [],
    total: 0,
    dailyCommits: [
      // seven Array, means from sunday to monday
      // sunday [1, 2, 3, 4] four repos commits on sunday
      // monday [0, 5, 3, 9] four repos commits on monday
      // ...
    ],
    totalDailyCommits: [
      // each item menus from sunday to monday
      // total commits count combine by all repos
      // 200, 201, 100, 198, 110, 150, 111
    ],
    monthReview: {
      // 1 to 12 month, each month commits count & new repos count
      // 1: { repos: [xxx, yyy], commitsCount: xxx }
    }
  };

  // initial monthReview
  for(let i = 1; i < 13; i++) {
    result.dailyCommits[(i - 1) % 7] = [];
    result.monthReview[i] = {
      repos: [],
      commitsCount: 0
    };
  }

  reposCommits.forEach((repository, repositoryIndex) => {
    const { created_at, pushed_at, commits, name } = repository;
    const month = getMonth(created_at);
    result.monthReview[month].repos.push(name);

    const weeklyCommits = [...BASE_DAYS];

    commits.forEach((commit, index) => {
      const { total, days, week } = commit;
      result.total += total;
      let targetCommit = result.commits[index];

      if (!targetCommit) {
        targetCommit = {
          total: 0,
          days: [...BASE_DAYS],
          week
        };
        result.commits.push(targetCommit);
      }

      targetCommit.total += total;
      days.forEach((day, i) => {
        targetCommit.days[i] += day;
        weeklyCommits[i] += day;

        const daySeconds = week - (7 - i) * 24 * 60 * 60;
        const month = getDateBySeconds(daySeconds, 'M');
        result.monthReview[month].commitsCount += day;
      });
    });
    weeklyCommits.forEach((commit, index) => {
      result.dailyCommits[index].push(commit);
    });
  });

  result.dailyCommits.forEach((dailyCommit, index) => {
    dailyCommit.sort();
    result.totalDailyCommits[index] = dailyCommit.reduce((pre, next) => pre + next, 0);
    result.dailyCommits[index] = dailyCommit.length % 2 === 0
      ? 0.5 * (dailyCommit[(dailyCommit.length / 2) - 1] + dailyCommit[dailyCommit.length / 2])
      : dailyCommit[(dailyCommit.length - 1) / 2];
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
        ? parseInt(stargazers_count)
        : reposLanguages[language] + parseInt(stargazers_count);
      return;
    }
    Object.keys(languages).forEach((language) => {
      if (reposLanguages[language]) {
        reposLanguages[language] += parseInt(stargazers_count);
      } else {
        reposLanguages[language] = parseInt(stargazers_count);
      }
    });
  });
  return reposLanguages;
}

const getLanguageUsed = (repos) => {
  const result = {};
  repos.forEach(repository => {
    const { languages } = repository;
    if (!languages) { return }
    Object.keys(languages).forEach(language => {
      if (result[language]) {
        result[language] += languages[language];
      } else {
        result[language] = languages[language];
      }
    });
  });
  return result;
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

const getReposByLanguage = (repos, targetLanguage) => {
  return repos.filter((repository) => {
    const { languages, language } = repository;
    if (!languages) {
      return language === targetLanguage;
    }
    return Object.keys(languages).some(key => key === targetLanguage);
  }).sort(sortRepos('stargazers_count'));
};

const getMinDate = (repos) => {
  const createDates = repos.map(repository => getSecondsByDate(repository['created_at']));
  return getFullDateBySecond(Math.min(...createDates));
};

const getMaxDate = (repos) => {
  const pushDates = repos.map(repository => getSecondsByDate(repository['pushed_at']));
  return getFullDateBySecond(Math.max(...pushDates));
};

const sortByDate = (repos) => {
  return repos.sort(sortRepos('created_at', getSecondsByDate)).reverse();
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
      html_url,
      full_name
    } = targetRepos[0];
    commit['forks_count'] = forks_count;
    commit['language'] = language;
    commit['stargazers_count'] = stargazers_count;
    commit['html_url'] = html_url;
    commit['full_name'] = full_name;
    return commit;
  });
};

const getReposCommits = (repos, commits) => {
  return repos.map((repository) => {
    const targetRepos = commits.filter(commit => commit.reposId === repository.reposId);
    if (targetRepos.length) {
      return targetRepos[0].totalCommits;
    }
    return 0;
  });
};

const getTotalCount = (repos) => {
  let totalStar = 0;
  let totalFork = 0;
  repos.forEach((repository) => {
    totalStar += repository['stargazers_count'];
    totalFork += repository['forks_count'];
  });
  return [totalStar, totalFork]
};

const getYearlyRepos = (repos) => {
  const yearAgoSeconds = dateHelper.seconds.beforeYears(1);
  return repos.filter((repository) => {
    return !repository.fork && getSecondsByDate(repository['created_at']) > yearAgoSeconds
  });
};

// private
const getMaxObject = (array, callback) => {
  let max = {};
  array.forEach((item, index) => {
    if (index === 0 || (index !== 0 && callback(item, max))) {
      max = item;
      max['persistTime'] = getSecondsByDate(item['pushed_at']) - getSecondsByDate(item['created_at']);
    }
  });
  return max;
};

const longestContributeRepos = (repos) => {
  return getMaxObject(repos, (currentRepos, maxRepos) => {
    const currentPresist = getSecondsByDate(currentRepos['pushed_at']) - getSecondsByDate(currentRepos['created_at']);
    return currentPresist > maxRepos.persistTime;
  });
};

export default {
  baseUrl,
  getReposNames,
  getReposForks,
  getReposStars,
  getLanguageDistribution,
  getLanguageSkill,
  getLanguageUsed,
  getReposLanguages,
  getReposByLanguage,
  combineReposCommits,
  getMinDate,
  getMaxDate,
  sortByDate,
  getReposByIds,
  getReposInfo,
  getReposCommits,
  getTotalCount,
  getYearlyRepos,
  longestContributeRepos
}

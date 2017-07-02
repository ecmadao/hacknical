import dateHelper from '../../utils/date';
import logger from '../../utils/logger';

const getMonth = dateHelper.getMonth;
const getDateBySeconds = dateHelper.getDateBySeconds;
const BASE_DAYS = [0, 0, 0, 0, 0, 0, 0];

export const combineReposCommits = (reposCommits) => {
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

  if (!reposCommits.length) {
    logger.error(`[COMMITS:EMPTY]`);
    return result;
  }

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
    result.totalDailyCommits[index] = dailyCommit.reduce(
      (pre, next) => pre + next, 0);
    result.dailyCommits[index] = dailyCommit.length % 2 === 0
      ? 0.5 * (dailyCommit[(dailyCommit.length / 2) - 1] + dailyCommit[dailyCommit.length / 2])
      : dailyCommit[(dailyCommit.length - 1) / 2];
  });

  return result;
};

export const getReposLanguages = (repos) => {
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

import dateHelper from '../../utils/date';
import logger from '../../utils/logger';

const getMonth = dateHelper.getMonth;
const getDateBySeconds = dateHelper.getDateBySeconds;
const BASE_DAYS = [0, 0, 0, 0, 0, 0, 0];

export const combineReposCommits = (reposCommits) => {
  const result = {
    commits: [],
    total: 0,
    // average of every weekday commit, from sunday to monday
    dailyCommits: [],
    // sum of every weekday commit, from sunday to monday
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
    logger.error('[COMMITS:EMPTY]');
    return result;
  }

  const commitsTmp = {};

  // initial monthReview
  for (let i = 1; i < 13; i += 1) {
    result.dailyCommits[(i - 1) % 7] = [];
    result.totalDailyCommits[(i - 1) % 7] = 0;
    result.monthReview[i] = {
      repos: [],
      commitsCount: 0
    };
  }

  reposCommits.forEach((repository) => {
    const { created_at, commits, name } = repository;
    const month = getMonth(created_at);
    result.monthReview[month].repos.push(name);

    const weeklyCommitsTmp = [...BASE_DAYS];
    for (let i = 0; i < commits.length; i += 1) {
      const commit = commits[i];
      const { total, days, week } = commit;
      result.total += total;

      if (commitsTmp[week] === undefined) {
        commitsTmp[week] = {
          week,
          total: 0,
          days: [...BASE_DAYS],
        }
      }
      commitsTmp[week].total += total;
      days.forEach((dayCommit, index) => {
        weeklyCommitsTmp[index] += dayCommit;
        commitsTmp[week].days[index] += dayCommit;
        result.totalDailyCommits[index] += dayCommit;

        const daySeconds = week - ((7 - index) * 24 * 60 * 60);
        const targetMonth = getDateBySeconds(daySeconds, 'M');
        result.monthReview[targetMonth].commitsCount += dayCommit;
      });
    }

    weeklyCommitsTmp.forEach((commit, index) => {
      result.dailyCommits[index].push(commit);
    });
  });

  const dailyCommits = [];
  result.dailyCommits.forEach((dailyCommit, index) => {
    dailyCommits[index] = Math.floor(result.totalDailyCommits[index] / dailyCommit.length);
  })
  result.dailyCommits = dailyCommits;
  result.commits = Object.keys(commitsTmp).map(week => commitsTmp[week]);
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

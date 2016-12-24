

const combineReposCommits = (reposCommits) => {
  console.log('raw')
  console.log(reposCommits);
  const result = {
    commits: [],
    total: 0,
    dailyCommits: [
      // from sunday to monday
      0, 0, 0, 0, 0, 0, 0
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
          result.dailyCommits[i] += day;
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

const getWeeklyCommits = (commits) => {

};

const getDailyCommits = (commits) => {

};

export default {
  combineReposCommits,
  getWeeklyCommits,
  getDailyCommits
}

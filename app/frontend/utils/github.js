

const combineReposCommits = (repos) => {
  const result = {
    commits: [],
    total: 0,
    dailyCommits: [
      // from sunday to monday
      0, 0, 0, 0, 0, 0, 0
    ]
  };
  repos.forEach((repository, repositoryIndex) => {
    repository.commits.forEach((commit, index) => {
      const { total, days } = commit;
      result.total += total;

      const targetCommit = result.commits[index];
      if (!targetCommit) {
        result.commits.push({
          total,
          days
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

const datas = {
  sections: {
    hotmap: {
      title: 'Hotmap'
    },
    baseInfo: {
      title: 'Basic Info',
      joinedAt: 'Joined at: '
    },
    social: {
      repositories: 'Repositories',
      followers: 'Followers',
      following: 'Following'
    },
    repos: {
      title: 'Repos Review',
      starsCount: 'Stars Count',
      forksCount: 'Forks Count',
      reposCount: 'Repos Count',
      popularestRepos: 'Most Popular Repos',
      maxStarPerRepos: 'Max Star/Repos',
      longgestRepos: 'Longgest Commit',
      chartTitle: 'star/fork/commit (last one year)',
      emptyText: 'No repositories info'
    },
    orgs: {
      title: 'Orgs Info',
      createdAt: 'Created at ',
      joinedRepos: 'Public repos you joined',
      contributionPercentage: 'Contribution percentage',
      emptyText: 'No organizations info'
    },
    languages: {
      title: 'Languages Review',
      maxReposCountLanguage: 'Has Max Repos',
      maxUsageLanguage: 'Max Usage',
      maxStarLanguage: 'Has Max Star',
      frequency: '',
      usageChart: {
        title: 'Language usage percentage',
        label: 'Percentage: '
      },
      starChart: {
        title: 'Stars language get',
        label: 'Stars relative to this language: '
      },
      emptyText: 'No languages info'
    },
    commits: {
      title: 'Commits Review',
      maxDay: 'Has Max Commits',
      averageCount: 'Commits/Week',
      firstCommit: 'First Commit In Last Year',
      maxCommitRepos: 'Has Max Commits',
      maxCommitCount: 'Max Commits Count',
      dailyCommitChartTitle: 'commits/days in last year',
      weeklyCommitChartTitle: 'commits/week in last year',
      emptyText: 'No commits info'
    }
  },
  modal: {
    shareText: 'Share your GitHub analysis'
  },
  operations: {
    share: {
      show: 'Show in share',
      hide: 'Hide in share'
    }
  }
};

export default datas;

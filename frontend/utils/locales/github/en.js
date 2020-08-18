const datas = {
  updateAt: 'Update at: ',
  message: {
    update: {
      header: 'Update succeed',
      body: 'GitHub data successfully update',
      error: 'Too frequent to update😕',
      success: 'Update succeed. Auto refresh page 3s later'
    },
  },
  sections: {
    hotmap: {
      title: 'Hotmap',
      total: 'Totoal contributions',
      longestStreak: 'Longest streak days',
      currentStreak: 'Current streak days',
      tipso: 'Count commits from to day you joined GitHub, using Sunday as the start of week.',
      streakError: 'No records found',
      weekly: 'The busiest week',
      daily: 'The crazy day',
    },
    info: {
      title: 'Basic info',
      joinedAt: 'Joined GitHub at %time'
    },
    baseInfo: {
      title: 'Basic info',
      joinedAt: 'Joined GitHub at %time'
    },
    predictions: {
      title: 'Guess your like',
      like: 'like',
      dislike: 'dislike',
      notShow: 'not show',
      tipso: 'Random created by your starred repositories. You can enhance your prediction modal by giving it a feedback.(Note: This part won\'t appera in your shared page.)'
    },
    statistic: {
      title: 'Star statistic',
      tipso: 'Using your starred repositories to statistic',
      languageChartTitle: 'Starred repositories languages',
      keywordsChartTitle: 'Starred repositories keywords',
      emptyText: 'Have no analysis result yet, please refresh later.'
    },
    social: {
      repositories: 'Repositories',
      followers: 'Followers',
      following: 'Following'
    },
    repos: {
      title: 'Repos review',
      starsCount: 'Stars count',
      forksCount: 'Forks count',
      reposCount: 'Repos count',
      popularestRepos: 'Most popular repository',
      popularestReposTip: 'Totally receive $ stars',
      maxStarPerRepos: 'Max Stars in single repository',
      longestRepos: 'Longest duration to contribute',
      chartTitle: 'star/fork/commit (last one year)',
      emptyText: 'No repositories info, please refresh in settings',
      originalRepos: 'Original repos',
      starPercentage: 'Star percentage',
      forkedRepos: 'Forked repos',
      createdRepos: 'Created repos',
      tipso: 'Haven\'t combine orgs/forked repos info yet'
    },
    course: {
      emptyText: 'No repositories info, please refresh in settings',
      title: 'Coding timeline',
      emptyCommit: 'Let it be',
      tipso: 'Repositories commit in the last year (only show top 10 repositories by commit amount)'
    },
    contributed: {
      title: 'Contributed repos',
      showMore: 'show more',
      hideMore: 'hide',
      tipso: 'Issue, PR for others repositories in the last year will be marked as contributions',
      emptyText: 'No repositories info, please refresh in settings',
    },
    orgs: {
      title: 'Orgs info',
      createdAt: 'Created at ',
      empty: 'No organizations info',
      joinedRepos: 'Public repos you joined',
      contributionPercentage: 'Contribution percentage',
      emptyText: 'No organizations info, please refresh in settings',
      coreDeveloper: 'Core developer',
      coreDeveloperIntro: 'More than 30% contributions',
      orgsCount: 'Joined orgs',
      reposCount: 'Joined repos',
      starsCount: 'Stars count',
      tipso: 'Only when you make yourself public in a organization can I get your orgs informations'
    },
    languages: {
      title: 'Coding languages',
      maxReposCountLanguage: 'Has most amount of repos',
      maxReposCountLanguageTip: 'Totally has $ repos relative to it',
      maxUsageLanguage: 'Max usage',
      maxUsageLanguageTip: 'You use it for almost $% times',
      maxStarLanguage: 'Has most stars',
      frequency: 'frequency',
      frequencyPercentage: 'percentage',
      usageChart: {
        title: 'Language usage percentage',
        label: 'Percentage: '
      },
      starChart: {
        title: 'stars of each language',
        label: 'Stars relative to this language: '
      },
      emptyText: 'No languages info, please refresh in settings',
      relativeRepos: 'Repos relatived to this language'
    },
    commits: {
      title: 'Commits roadmap',
      maxDay: 'Your favorite day to commit',
      averageCount: 'Weekly commits',
      firstCommit: 'First commit in the last year',
      maxCommitRepos: 'Has most commits',
      maxCommitReposTip: 'Totally has $ commits',
      maxCommitCount: 'Max commits in single repository',
      avgCommitTitle: 'Average commits per day',
      dailyCommitChartTitle: 'Commits distribution in the last year',
      weeklyCommitChartTitle: 'commits in the last year',
      monthlyCommitChartTitle: 'monthly commits in the last year',
      emptyText: 'No commits info, please refresh in settings',
      maxCommitDate: 'Max commit date',
      maxDailyCommits: 'Max daily commits',
      maxReposCountMonth: 'You have most inspirations',
      maxReposCountMonthTip: 'Created: $',
      maxCommitsCountMonth: 'Your busiest month',
      maxCommitsCountMonthTip: 'Totally has $ commits',
      monthlyView: 'Monthly view',
      weeklyView: 'Weekly view',
      dailyView: 'Daily view',
      tipso: 'Record your commits in the last year'
    }
  },
  modal: {
    shareText: 'to share your GitHub analysis'
  },
  operations: {
    share: {
      show: 'Show in share',
      hide: 'Hide in share',
      enable: 'Click to show this section on share page'
    }
  }
}

export default datas

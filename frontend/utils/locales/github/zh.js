const datas = {
  updateAt: '更新于：',
  message: {
    update: {
      header: '数据更新完成',
      body: 'GitHub 数据更新完成，请刷新页面',
      error: '更新太频繁了😕',
      success: '更新完成，3秒后刷新页面'
    },
  },
  sections: {
    hotmap: {
      title: '活跃度',
      total: '历史总提交数',
      longestStreak: '最长连击天数',
      currentStreak: '当前连击天数',
      tipso: '统计历史上所有提交数据，以周一作为每周的开始',
      streakError: '暂无记录，快去搬砖！',
      weekly: '提交数目最多的一周',
      daily: '提交数目最多的一天',
    },
    info: {
      title: '基本信息',
      joinedAt: '%time 加入 GitHub'
    },
    baseInfo: {
      title: '基本信息',
      joinedAt: '%time 加入 GitHub'
    },
    social: {
      repositories: 'Repositories',
      followers: 'Followers',
      following: 'Following'
    },
    predictions: {
      title: '猜你喜欢',
      like: '喜欢',
      dislike: '差评',
      notShow: '不再显示',
      tipso: '分析你 star & create 的项目后随机生成。你可以通过点击“喜欢”或“差评”来训练模型（这一部分不会从出现在你分享出去的页面上）'
    },
    statistic: {
      title: 'Star 统计',
      tipso: '根据你标记 Star 的项目进行统计，展现你偏爱的语言和关键字',
      languageChartTitle: 'Star 的仓库的语言分布',
      keywordsChartTitle: 'Star 的仓库的关键字提取',
      emptyText: '暂无分析结果，请稍后刷新重试'
    },
    repos: {
      title: '仓库概览',
      starsCount: '收获 star 数',
      forksCount: '收获 fork 数',
      reposCount: '创建的仓库数',
      popularestRepos: '最受欢迎的仓库',
      popularestReposTip: '总共收获 $ 个 star',
      maxStarPerRepos: '单个仓库最多 star 数',
      longestRepos: '持续时间最久的仓库',
      chartTitle: '仓库 fork/star/过去一年内 commits 数一览（取前十）',
      emptyText: '暂未抓取到仓库信息，请在设置中进行刷新',
      originalRepos: '原创仓库',
      starPercentage: 'Star 比例',
      forkedRepos: 'fork 的仓库',
      createdRepos: '创建的仓库',
      tipso: '暂未统计组织内/ fork 的项目信息，敬请期待'
    },
    course: {
      emptyText: '暂未抓取到仓库信息，请在设置中进行刷新',
      title: '编码历程',
      emptyCommit: '没有找到提交记录',
      tipso: '近一年来各仓库提交的编程历程，截取展现提交频繁的数个仓库'
    },
    contributed: {
      title: '参与贡献的仓库',
      showMore: '展现更多',
      hideMore: '收起',
      tipso: '过去一年内对他人仓库的 Issue, PR 都会被记为贡献',
      emptyText: '暂未抓取到仓库信息，请在设置中进行刷新',
    },
    orgs: {
      title: '隶属组织',
      empty: '暂无数据',
      createdAt: '创建于 ',
      joinedRepos: '参与的公开项目',
      contributionPercentage: '贡献比例',
      emptyText: '暂未抓取到仓库信息，请在设置中进行刷新',
      coreDeveloper: '核心开发者',
      coreDeveloperIntro: '对项目的贡献比例超过30%',
      orgsCount: '参与的组织数',
      reposCount: '参与的项目数',
      starsCount: '获得的 star 数',
      tipso: '只有用户将自己在组织中的信息设置为公开可见时，才能抓取到数据。如果没有贡献信息，请在“设置”内进行刷新'
    },
    languages: {
      title: '编程语言',
      maxReposCountLanguage: '拥有最多的仓库',
      maxReposCountLanguageTip: '总共有 $ 个仓库与它相关',
      maxUsageLanguage: '最常使用的语言',
      maxUsageLanguageTip: '使用频率达到 $%',
      maxStarLanguage: '拥有最多的 star',
      frequency: '语言使用频次',
      frequencyPercentage: '使用频次占比',
      usageChart: {
        title: '语言使用频次',
        label: '占比：'
      },
      starChart: {
        title: '语言 & 获得 star',
        label: '与该语言相关 star 数：'
      },
      emptyText: '暂未抓取到仓库信息，请在设置中进行刷新',
      relativeRepos: '与该语言相关的仓库'
    },
    commits: {
      title: '贡献信息',
      maxDay: '是你最喜欢提交的日子',
      averageCount: '平均每周提交次数',
      firstCommit: '过去一年第一次提交代码',
      maxCommitRepos: '提交次数最多的仓库',
      maxCommitReposTip: '总共有 $ 次提交',
      maxCommitCount: '单个仓库最多提交数',
      avgCommitTitle: '平均每日提交数',
      dailyCommitChartTitle: '过去一年每日提交数分布',
      weeklyCommitChartTitle: '过去一年每周提交数一览',
      monthlyCommitChartTitle: '过去一年每月提交数一览',
      emptyText: '暂未抓取到仓库信息，请在设置中进行刷新',
      maxCommitDate: '提交最多的一天',
      maxDailyCommits: '一天最多提交次数',
      maxReposCountMonth: '是你思如尿崩的时期',
      maxReposCountMonthTip: '创建了：$',
      maxCommitsCountMonth: '是你玩命码字的时期',
      maxCommitsCountMonthTip: '总共有 $ 次提交',
      monthlyView: '月视图',
      weeklyView: '周视图',
      dailyView: '日视图',
      tipso: '过去一年内的提交记录'
    }
  },
  modal: {
    shareText: '分享你的 GitHub 总结'
  },
  operations: {
    share: {
      show: '在分享中展示',
      hide: '在分享中隐藏',
      enable: '戳我即可在分享中展示'
    }
  }
}

export default datas

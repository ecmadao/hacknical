const datas = {
  tabs: {
    records: {
      text: '数据统计',
      tipso: '记录你分享出去的页面的浏览量'
    },
    resume: {
      text: '简历',
      tipso: ''
    },
    github: {
      text: 'GitHub',
      tipso: ''
    },
    setting: {
      text: '设置',
      tipso: ''
    },
    about: {
      text: '关于',
      tipso: ''
    },
    logout: {
      text: '退出登录',
      tipso: ''
    }
  },
  headers: {
    zen: 'GitHub 之禅',
    about: '关于网站',
    feedback: '意见反馈',
    logout: '退出登录'
  },
  archive: {
    resume: {
      previewModal: '按 ESC 即可退出预览'
    }
  },
  records: {
    title: {
      link: '分享链接',
      logs: '最近 {LOGS_COUNT} 次访问',
      statistic: '访问来源统计'
    },
    resume: {
      title: '简历',
      shareText: '扫码分享个人简历'
    },
    github: {
      title: 'GitHub',
      shareText: '扫码分享 GitHub 报告'
    },
    common: {
      pv: '总 PV',
      maxPvPerHour: '一小时内最大 PV',
      platform: '使用最多的平台',
      browser: '使用最多的浏览器',
      platformChartTitle: '浏览量来源平台',
      browserChartTitle: '浏览器分布',
      hourlyViewChartTitle: '每小时浏览量',
      dailyViewChartTitle: '每日浏览量',
      monthlyViewChartTitle: '每月浏览量',
      hourlyViewChart: '每小时',
      dailyViewChart: '每日',
      monthlyViewChart: '每月',
      resume: '简历',
      copied: '链接已复制',
      empty: '暂无数据'
    }
  },
  setting: {
    refresh: '数据更新',
    shareConfig: '分享设置',
    shareUrl: '分享链接',
    github: {
      title: 'GitHub 相关设置',
      openShare: '开启 GitHub 总结的分享',
      lastUpdate: '最近更新时间',
      updateButtonText: '更新数据',
      customize: {
        title: '自定义仓库展示',
        button: '点击更改',
        confirm: '确认',
        checkAll: '全选',
        filter: '筛选仓库'
      },
    },
    order: {
      ordering: '各模块排序与展示',
      orderingError: '该模块不可排序',
      orderingFixedError: '固定模块不可改变相对顺序',
      orderingTip: '拖拽排序模块展示顺序；点击某一行，可改变其在分享页面中的可见性',
    },
    resume: {
      title: '简历相关设置',
      openShare: '开启简历的分享',
      simplifyUrl: '使用简化的公开链接',
      simplifyUrlTip: '关闭之后，无法再通过 :login/resume 链接访问公开简历，而转为更加私密的 resume/:hash',
      useGithub: '在简历中附加我的 GitHub 分析报告',
      autosave: '编辑时自动保存',
      reminder: {
        title: '定期提醒我维护简历',
        sendEmailTo: '发邮件到',
        placeholder: '接收提醒的邮箱'
      },
    }
  }
}

export default datas

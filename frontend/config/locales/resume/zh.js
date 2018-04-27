const datas = {
  updateAt: '更新于：',
  editedConfirm: '简历已编辑，不保存吗？',
  buttons: {
    save: '保存',
    preview: '预览',
    pre: '上一步',
    next: '下一步'
  },
  messages: {
    download: '简历生成中，请稍后（初次生成所需的时间稍长）',
    downloadTip: '如简历有更新，请先保存再下载',
    templateTip: '改变简历模板',
    downloadSuccess: '简历生成完毕，正在下载',
    downloadError: '简历生成失败'
  },
  modal: {
    shareText: '分享你的个人简历'
  },
  sections: {
    info: {
      title: '基本信息',
      name: '姓名',
      email: '邮箱',
      phone: '电话',
      job: '意向职位',
      position: '所在城市',
      hireAvailable: '正在求职',
      freshGraduate: '我是应届生',
      gender: '性别'
    },
    edu: {
      title: '教育经历',
      subTitle: '在校经历',
      mainButton: '添加教育经历',
      school: '学校名称',
      major: '院系 & 专业',
      entranceAt: '入学时间',
      graduateAt: '毕业时间',
      addEduExperience: '你在学校做了什么？',
      introText: '输入社团活动、在校期间取得的成就，并按下回车来创建'
    },
    work: {
      title: '工作经历',
      subTitle: '实习经历',
      mainButton: '添加工作经历',
      sideButton: '添加参与的项目',
      companyInfo: '公司信息',
      companyName: '公司名称',
      homepage: '填写公司主页有利于展现自己的职业经历（选填）',
      position: '所处职位',
      entriedAt: '入职时间',
      dimissionAt: '离职时间',
      untilNow: '至今',
      joinedProjects: '参与项目',
      projectName: '项目名称',
      projectHomepage: '项目线上地址可以让对方更快的了解你（选填）',
      addProjectDesc: '新增项目描述',
      introText: '输入一句项目描述，并按下回车来创建'
    },
    projects: {
      title: '个人项目',
      projectName: '填写项目名称',
      homepage: '没有线上地址还怎么展现实力？（选填）',
      projectDesc: '填写项目描述',
      technologies: '添加使用的技术',
      mainButton: '添加个人项目'
    },
    others: {
      title: '其他补充',
      expectSalary: '期待月薪',
      expectCity: '期望工作地点',
      yourDream: '你的梦想/slogan？',
      personalIntro: '新增个人介绍、自我评价',
      introText: '输入一句个人介绍，并按下回车来创建',
      selfAssessment: '自我评价',
      and: '与',
      links: {
        title: '其他链接',
        github: '填写 github 地址',
        segmentfault: '填写 segmentfault 地址',
        blog: '填写 blog 地址',
        stackoverflow: '填写 stackoverflow 地址',
        xitu: '填写 稀土掘金 地址'
      }
    }
  },
  navs: {
    info: '基本信息',
    edu: '教育经历',
    inSchool: '在校经历',
    work: '工作经历',
    internship: '实习经历',
    projects: '个人项目',
    others: '其他补充',
  },
  options: {
    genders: {
      male: '男',
      female: '女'
    },
    person: {
      male: '他',
      female: '她'
    },
    edus: {
      juniorHigh: '初中',
      seniorHigh: '高中',
      juniorCollege: '大专',
      undergraduate: '本科',
      master: '硕士',
      doctor: '博士',
      others: '其他'
    },
    view: '查看%s的 GitHub 总结报告',
    back: '返回'
  },
  mobile: {
    empty: '没有找到个人简历',
    tip: '请在 PC 网页端进行创建'
  },
  labels: {
    freshGraduate: '应届生',
    hireAvailable: '求职中',
    atWork: '目前在职',
    atSchool: '目前在校'
  },
  intros: [
    {
      title: '使用说明',
      texts: [
        '逐步完善你的简历，随时可以通过 cmd/win + s 快捷键保存简历',
        'shift + <-/-> 切换上一步/下一步',
        '点击 "预览"（或 cmd/win + p ）以预览当前简历',
      ]
    },
    {
      title: '小建议',
      texts: [
        '技术热情很重要',
        '请展现你的做事态度',
        '大家都喜欢学习能力强，能够自我进步的人',
        '技术经验越多越好；但如果缺乏，至少要表现出成长潜力'
      ]
    }
  ]
};

export default datas;

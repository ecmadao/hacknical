const datas = {
  updateAt: '更新于：',
  editedConfirm: '简历已编辑，不保存吗？',
  buttons: {
    save: '保存',
    saving: '保存中',
    preview: '预览',
    pre: '上一步',
    next: '下一步',
    confirm: '确定'
  },
  messages: {
    download: '简历生成中，请稍后（初次生成所需的时间稍长）',
    downloadTip: '如简历有更新，请先保存再下载',
    downloadOptions: {
      onePage: '整页不切分',
      clippedPages: '分页',
    },
    templateTip: '改变简历模板',
    languageTip: '切换语言。已有简历不变，将会生成该语言下的简历',
    downloadSuccess: '简历生成完毕，正在下载',
    downloadError: '简历生成失败',
    addModuleError: {
      emptyName: '请输入模块名称',
      duplicateName: '模块名称已存在',
    }
  },
  modal: {
    shareText: '分享你的个人简历',
    chooseTemplate: '简历模板选择',
    contributeTemplate: '有更好的模板建议？在 issue 里提出反馈'
  },
  sections: {
    info: {
      title: '基本信息',
      name: '姓名',
      avator: {
        change: '选取头像',
        submit: '提交',
        error: '文件不能超过 4M',
        success: '上传完成',
        upload: '上传中...',
        intro: '点击修改个人头像',
        tip: '图片大小限制 4M，仅支持 jpeg,jpg,png 格式'
      },
      email: '邮箱',
      emailPrefix: '邮箱前缀',
      emailSuffix: '邮箱后缀',
      phone: '电话',
      job: '意向职位',
      position: '所在城市',
      hireAvailable: '正在求职',
      privacyProtect: {
        enabled: '号码保护已开启',
        disabled: '号码保护未开启'
      },
      freshGraduate: '我是应届生',
      gender: '性别',
      introText: '按下回车即可添加',
      languages: '擅长的语言或方向'
    },
    educations: {
      title: '教育经历',
      subTitle: '在校经历',
      mainButton: '添加教育经历',
      school: '学校名称',
      major: '院系 & 专业',
      entranceAt: '入学时间',
      graduateAt: '毕业时间',
      addEduExperience: '你在学校做了什么？填入描述，并按下回车来创建',
      introList: [
        '可以通过一些在校经历来反映你的热情和学习能力',
        '参与过什么比赛或者社团活动？又从中贡献了什么，学到了什么？',
        '不用吝啬，把你引以为豪的经历都抛出来吧'
      ],
      introText: '写写独特的学习或实习经历？'
    },
    workExperiences: {
      title: '工作经历',
      subTitle: '实习经历',
      technologies: '技术栈',
      mainButton: '添加工作经历',
      sideButton: '添加参与的项目',
      companyInfo: '公司信息',
      companyName: '公司名称',
      homepage: '填写公司主页（选填）',
      position: '所处职位',
      entriedAt: '入职时间',
      dimissionAt: '离职时间',
      untilNow: '至今',
      joinedProjects: '参与项目',
      projectName: '项目名称',
      projectHomepage: '项目线上地址（选填）',
      addProjectDesc: '输入项目描述，并按下回车来创建',
      introText: '结合自身经历，尽量避免泛泛而谈',
      techIntroText: '按下回车即可添加',
      introList: [
        '首先应该大致介绍项目背景，这个项目是干什么的？',
        '描述自己在项目中扮演的角色、自己的职责',
        '自己在项目内使用的技术，都做了哪些事',
        '项目最终结果、自身评估'
      ]
    },
    personalProjects: {
      title: '个人项目',
      projectName: '填写项目名称',
      homepage: '没有线上地址还怎么展现实力？（选填）',
      projectDesc: '填写项目描述。利用什么技术做了什么，最终达到了怎样的效果？',
      technologies: '添加使用的技术',
      mainButton: '添加个人项目',
      introText: '按下回车即可添加',
      introList: [],
      textareaWordCount: '已输入 %n 字'
    },
    others: {
      title: '其他补充',
      expectSalary: '期待月薪',
      expectCity: '期望工作地点',
      yourDream: '你的梦想/slogan？',
      personalIntro: '填写个人介绍、自我评价，并按下回车来创建',
      introList: [
        '还有哪些想要展现的技能、经历？',
        '还可以说说自身对公司的期望，或者自己下一步想要实现的目标',
        '太普遍的基础技能，或者软硬件环境之类的技术或许可以忽略不讲',
        '不要突出自己的软肋，不要随便用“精通”二字',
      ],
      introText: '个人介绍切勿泛泛空谈',
      selfAssessment: '自我评价',
      and: '与',
      links: {
        title: '其他链接',
        github: '填写 GitHub 地址',
        segmentfault: '填写 Segmentfault 地址',
        blog: '填写博客地址',
        stackoverflow: '填写 Stackoverflow 地址',
        xitu: '填写 稀土掘金 地址',
        addLinkName: '填写链接名称',
        addLinkUrl: '填写链接地址',
      }
    },
    custom: {
      title: '自定义模块',
      homepage: '相关链接',
      mainButton: '添加一段内容',
      sideButton: '添加描述',
      introText: '添加相应的描述',
      sectionTitle: '标题',
      addSectionDetail: '输入描述，并按下回车添加'
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
    addNew: {
      nav: '新增模块'
    },
    moduleName: {
      nav: '模块名称'
    }
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
    reminders: {
      prefix: '每',
      quarterly: '季度',
      monthly: '月',
      weekly: '周',
      days3: '三天'
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
        'shift + ←/→ 切换上一步/下一步',
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
  ],
  tips: {
    educations: {
      graduate: '应届生可能没有很多的经验，可以用学校和在校经历弥补',
      normal: ''
    },
    workExperiences: {
      graduate: '有相关实习经历是再好不过了，但还请牢记“宁缺毋滥”',
      normal: '突出重点项目，按时间从近到远，和职位需求匹配度高低来决定自己书写的重点'
    },
    personalProjects: '个人项目可以侧面展现自己的学习能力和职业发展路线',
    others: '太基础的技能就不用强调了。正确书写技术名词，切记请勿随意“精通”'
  }
}

export default datas

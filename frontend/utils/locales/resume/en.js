const datas = {
  updateAt: 'Last update: ',
  editedConfirm: "Resume edited, don't wanna save?",
  buttons: {
    save: 'Save',
    saving: 'Saving',
    preview: 'Preview',
    pre: 'Pre',
    next: 'Next',
    confirm: 'Confirm'
  },
  messages: {
    download: 'Resume is rendering, please wait later.',
    downloadTip: 'Please save your changes before download resume',
    templateTip: 'Change resume template',
    downloadSuccess: 'Successfully created, downloading now',
    downloadError: 'Resume create failed',
    addModuleError: {
      emptyName: 'Please input module name',
      duplicateName: 'Module name existed',
    }
  },
  modal: {
    shareText: 'to share your resume',
    chooseTemplate: 'Choose resume template',
    contributeTemplate: 'Have advice for template? Come to create issue!'
  },
  sections: {
    info: {
      title: 'Basic Info',
      name: 'Name',
      avator: {
        change: 'Choose',
        submit: 'Submit',
        error: 'File size should less than 4M',
        success: 'Upload succeed',
        upload: 'Uploading...',
        intro: 'Click to change avator',
        tip: '4M size limit, support jpeg,jpg,png'
      },
      email: 'Email',
      emailPrefix: 'Email prefix',
      emailSuffix: 'Email suffix',
      phone: 'Phone',
      job: 'Wanted job',
      position: 'City',
      hireAvailable: 'Available for hire',
      privacyProtect: {
        enabled: 'Privacy protect enabled',
        disabled: 'Privacy protect disabled'
      },
      freshGraduate: 'I\'m fresh graduate',
      gender: 'Gender',
      introText: 'Press enter to add',
      languages: ''
    },
    educations: {
      title: 'Education Experience',
      subTitle: 'In-School Experience',
      mainButton: 'Add edu experience',
      school: 'School name',
      major: 'Your major',
      entranceAt: 'Entrance at',
      graduateAt: 'Graduate at',
      addEduExperience: 'What did you do in your college?',
      introList: [],
      introText: 'Write the activities you joined or achievements, then press enter to create it'
    },
    workExperiences: {
      title: 'Work Experience',
      subTitle: 'Internship Experience',
      mainButton: 'Add work experience',
      sideButton: 'Add project you joined',
      companyInfo: 'Company Info',
      companyName: 'Company name',
      homepage: 'Company homepage',
      position: 'Your position',
      entriedAt: 'Entried at',
      dimissionAt: 'Dimission at',
      untilNow: 'Until now',
      joinedProjects: 'Joined projects',
      projectName: 'Project name',
      projectHomepage: 'Project homepage',
      addProjectDesc: 'Add project desc',
      introList: [],
      introText: 'Wirte the project desc then press enter to create it'
    },
    personalProjects: {
      title: 'Personal Projects',
      projectName: 'Project name',
      homepage: 'Talk is cheap, show me your code',
      projectDesc: 'Project desc',
      technologies: 'Technologies',
      mainButton: 'Add personal projects',
      introText: 'Press enter to add',
      introList: [],
      textareaWordCount: '%n letters typed'
    },
    others: {
      title: 'Others Info',
      expectSalary: 'Expect salary',
      expectCity: 'Expect workplace',
      yourDream: 'Your dream/slogan?',
      personalIntro: 'Personal intro/Self assessment',
      introList: [],
      introText: 'Wirte your personal intro then press enter to create it',
      selfAssessment: 'Self Assessment',
      and: 'and',
      links: {
        title: 'Other Links',
        github: 'Your GitHub link',
        segmentfault: 'Your Segmentfault link',
        blog: 'Your blog link',
        stackoverflow: 'Your Stackoverflow link',
        xitu: 'Your xitu link',
        addLinkName: 'Add link name',
        addLinkUrl: 'Add url',
      }
    },
    custom: {
      mainButton: 'Add new section',
      sideButton: 'Add description',
      homepage: 'Related url',
      introText: 'Description for your section',
      sectionTitle: 'title',
      addSectionDetail: 'Add description, then press Enter to add it'
    }
  },
  navs: {
    info: 'Info',
    edu: 'Edu',
    inSchool: 'Edu',
    work: 'Jobs',
    internship: 'Internship',
    projects: 'Projects',
    others: 'Other',
    addNew: 'Add new',
    moduleName: 'Module name'
  },
  options: {
    genders: {
      male: 'Male',
      female: 'Female'
    },
    person: {
      male: 'his',
      female: 'her'
    },
    edus: {
      juniorHigh: 'Junior high',
      seniorHigh: 'Senior high',
      juniorCollege: 'Junior college',
      undergraduate: 'Bachelor',
      master: 'Master',
      doctor: 'Doctor',
      others: 'Others'
    },
    reminders: {
      prefix: 'Every',
      quarterly: 'Quarter',
      monthly: 'Month',
      weekly: 'Week',
      days3: '3 days'
    },
    view: 'Check %s GitHub visualize report',
    back: 'Back'
  },
  mobile: {
    empty: 'Can not found resume',
    tip: 'Please create a rusume on desktop webpage'
  },
  labels: {
    freshGraduate: 'Fresh Graduate',
    hireAvailable: 'Hire Available',
    atWork: 'At Work',
    atSchool: 'At School'
  },
  intros: [
    {
      title: 'Instructions',
      texts: [
        'Complete your resume step by step, and you can use cmd/win + s to save it at any time',
        'Use shift + ←/→ to switch previous/next step',
        'Click "Preview"(or using cmd/win + p) to preview your resume'
      ]
    },
    {
      title: 'Tips',
      texts: [
        'Enthusiasm for technology is important',
        'Please show your attitude toward work',
        'Self-improvement is important and popular',
        'The more experience you have, the better'
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

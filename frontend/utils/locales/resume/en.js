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
    downloadOptions: {
      onePage: 'One page',
      clippedPages: 'Clipped pages',
    },
    templateTip: 'Change resume template',
    languageTip: 'Change language. Will generate a new resume',
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
      title: 'Basic info',
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
      languages: 'Your skill'
    },
    educations: {
      title: 'Education experience',
      subTitle: 'In-School Experience',
      mainButton: 'Add edu experience',
      school: 'School name',
      major: 'Your major',
      entranceAt: 'Entrance at',
      graduateAt: 'Graduate at',
      addEduExperience: 'What did you do in your college?',
      introList: [],
      introText: 'Write the activities you joined or achievements, then press enter to create'
    },
    workExperiences: {
      title: 'Work experience',
      subTitle: 'Internship Experience',
      technologies: 'Coding languages or tools',
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
      introText: 'Wirte the project desc then press enter to create',
      techIntroText: 'Press Enter to add',
    },
    personalProjects: {
      title: 'Personal projects',
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
      title: 'Others info',
      expectSalary: 'Expect salary',
      expectCity: 'Expect workplace',
      yourDream: 'Your dream/slogan?',
      personalIntro: 'Personal intro/Self assessment',
      introList: [],
      introText: 'Wirte your personal intro then press enter to create',
      selfAssessment: 'Self assessment',
      and: ' and ',
      links: {
        title: 'Other links',
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
      title: 'Custom module',
      mainButton: 'Add new section',
      sideButton: 'Add description',
      homepage: 'Related url',
      introText: 'Description for your section',
      sectionTitle: 'title',
      addSectionDetail: 'Write description, then press Enter to add'
    }
  },
  navs: {
    info: {
      nav: 'Basic',
      headline: 'Basic Information'
    },
    edu: {
      nav: 'Edu',
      headline: 'Education'
    },
    inSchool: {
      nav: 'Edu',
      headline: 'Education'
    },
    work: {
      nav: 'Jobs',
      headline: 'Work Experience'
    },
    internship: {
      nav: 'Internship',
      headline: 'Internship'
    },
    projects: {
      nav: 'Projects',
      headline: 'Personal Projects'
    },
    others: {
      nav: 'Others',
      headline: 'Others Information',
    },
    addNew: {
      nav: 'Add new',
    },
    moduleName: {
      nav: 'Module name'
    }
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

const datas = {
  updateAt: 'Last update: ',
  editedConfirm: "Resume edited, don't wanna save?",
  buttons: {
    save: 'Save',
    preview: 'Preview',
    pre: 'Pre',
    next: 'Next'
  },
  messages: {
    download: 'Resume is rendering, please wait later.',
    downloadTip: 'Please save your changes before download resume',
    templateTip: 'Change resume template',
    downloadSuccess: 'Successfully created, downloading now',
    downloadError: 'Resume create failed'
  },
  modal: {
    shareText: 'to share your resume'
  },
  sections: {
    info: {
      title: 'Basic Info',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      job: 'Wanted job',
      position: 'City',
      hireAvailable: 'Available for hire',
      freshGraduate: 'I\'m fresh graduate',
      gender: 'Gender'
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
      introList: []
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
      undergraduate: 'Undergraduate',
      master: 'Master',
      doctor: 'Doctor',
      others: 'Others'
    },
    reminders: {
      quarterly: 'Quarterly',
      monthly: 'Monthly',
      weekly: 'Weekly',
      days3: 'Every 3 days'
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
        'Use shift + <-/-> to switch previous/next step',
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
  ]
};

export default datas;

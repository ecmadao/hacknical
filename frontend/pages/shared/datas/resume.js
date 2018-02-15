import locales from 'LOCALES';

const resumeTexts = locales('resume');
const navTexts = resumeTexts.navs;
const genderTexts = resumeTexts.options.genders;
const eduTexts = resumeTexts.options.edus;

const RESUME_SECTION_IDS = {
  INFO: 'info',
  EDUCATIONS: 'educations',
  WORK_EXPERIENCE: 'workExperiences',
  PERSONAL_PROJECTS: 'personalProjects',
  OTHERS: 'others',
};

export const RESUME_SECTIONS = {
  normal: [
    {
      id: RESUME_SECTION_IDS.INFO,
      text: navTexts.info
    },
    {
      id: RESUME_SECTION_IDS.WORK_EXPERIENCE,
      text: navTexts.work,
    },
    {
      id: RESUME_SECTION_IDS.PERSONAL_PROJECTS,
      text: navTexts.projects
    },
    {
      id: RESUME_SECTION_IDS.EDUCATIONS,
      text: navTexts.edu,
    },
    {
      id: RESUME_SECTION_IDS.OTHERS,
      text: navTexts.others
    }
  ],
  freshGraduate: [
    {
      id: RESUME_SECTION_IDS.INFO,
      text: navTexts.info
    },
    {
      id: RESUME_SECTION_IDS.EDUCATIONS,
      text: navTexts.inSchool,
    },
    {
      id: RESUME_SECTION_IDS.WORK_EXPERIENCE,
      text: navTexts.internship,
    },
    {
      id: RESUME_SECTION_IDS.PERSONAL_PROJECTS,
      text: navTexts.projects
    },
    {
      id: RESUME_SECTION_IDS.OTHERS,
      text: navTexts.others
    }
  ]
};

export const GENDERS = [
  {
    id: 'male',
    value: genderTexts.male
  },
  {
    id: 'female',
    value: genderTexts.female
  }
];

export const EDUCATIONS = [
  {
    id: '初中',
    value: eduTexts.juniorHigh
  },
  {
    id: '高中',
    value: eduTexts.seniorHigh
  },
  {
    id: '大专',
    value: eduTexts.juniorCollege
  },
  {
    id: '本科',
    value: eduTexts.undergraduate
  },
  {
    id: '硕士',
    value: eduTexts.master
  },
  {
    id: '博士',
    value: eduTexts.doctor
  },
  {
    id: '其他',
    value: eduTexts.others
  }
];

export const SOCIAL_LINKS = [
  {
    name: 'github',
    icon: 'github.png',
    url: ''
  },
  {
    name: 'segmentfault',
    icon: 'sg.jpg',
    url: ''
  },
  {
    name: 'blog',
    text: '个人博客',
    icon: 'blog.png',
    url: ''
  },
  {
    name: 'stackoverflow',
    icon: 'stackoverflow.png',
    url: ''
  },
  {
    name: 'xitu',
    text: '稀土掘金',
    icon: 'gold.jpeg',
    url: ''
  }
];
export const LINK_NAMES = {
  github: 'github',
  segmentfault: 'segmentfault',
  blog: '个人博客',
  stackoverflow: 'stackoverflow',
  xitu: '稀土掘金'
};

export const INFO = {
  name: '',
  email: '',
  phone: '',
  gender: 'male',
  location: '',
  avator: '',
  intention: '',
  hireAvailable: false,
  freshGraduate: false,
};

export const EDU = {
  school: '',
  major: '',
  education: EDUCATIONS[0].id,
  startTime: '',
  endTime: '',
  experiences: [],
};

export const WORK_EXPERIENCE = {
  company: '',
  url: '',
  startTime: '',
  endTime: '',
  position: '',
  projects: []
};

export const WORK_PROJECT = {
  name: '',
  url: '',
  details: []
};

export const PERSONAL_PROJECT = {
  url: '',
  desc: '',
  title: '',
  techs: []
};

export const OTHERS = {
  expectLocation: '',
  expectLocations: [],
  expectSalary: '',
  dream: '',
  supplements: [],
  socialLinks: [...SOCIAL_LINKS]
};

import locales from 'LOCALES';

const resumeTexts = locales("resume");
const navTexts = resumeTexts.navs;
const genderTexts = resumeTexts.options.genders;

export const RESUME_SECTIONS = [
  {
    id: 'info',
    text: navTexts.info
  },
  {
    id: 'educations',
    text: navTexts.edu
  },
  {
    id: 'workExperiences',
    text: navTexts.work
  },
  {
    id: 'personalProjects',
    text: navTexts.projects
  },
  {
    id: 'others',
    text: navTexts.others
  }
];

export const GENDERS = [
  {
    id: 'male',
    text: genderTexts.male
  },
  {
    id: 'female',
    text: genderTexts.female
  }
];

export const EDUCATIONS = [
  {
    id: '初中',
    text: '初中'
  },
  {
    id: '高中',
    text: '高中'
  },
  {
    id: '大专',
    text: '大专'
  },
  {
    id: '本科',
    text: '本科'
  },
  {
    id: '硕士',
    text: '硕士'
  },
  {
    id: '博士',
    text: '博士'
  },
  {
    id: '其他',
    text: '其他'
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
  intention: ''
};

export const EDU = {
  school: '',
  major: '',
  education: EDUCATIONS[0].id,
  startTime: '',
  endTime: '',
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

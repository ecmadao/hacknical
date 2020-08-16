
import locales from 'LOCALES'

const resumeTexts = locales('resume')
const sectionTexts = resumeTexts.sections
const navTexts = resumeTexts.navs
const genderTexts = resumeTexts.options.genders
const reminderTexts = resumeTexts.options.reminders
const eduTexts = resumeTexts.options.edus

export const RESUME_SECTION_IDS = {
  INFO: 'info',
  OTHERS: 'others',
  EDUCATIONS: 'educations',
  WORK_EXPERIENCE: 'workExperiences',
  PERSONAL_PROJECTS: 'personalProjects',
  ADD_NEW: 'addNew',
  CUSTOM: 'custom'
}

const REMINDER_CRON_TYPES = {
  DAYS3: 'days3',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
}

export const DEFAULT_AVATOR = '//files.hacknical.com/defaults/avator/v1.png'

export const REMINDER_PREFIX = reminderTexts.prefix

export const REMINDER_INTERVALS = [
  {
    id: REMINDER_CRON_TYPES.QUARTERLY,
    value: reminderTexts.quarterly
  },
  {
    id: REMINDER_CRON_TYPES.MONTHLY,
    value: reminderTexts.monthly
  },
  {
    id: REMINDER_CRON_TYPES.WEEKLY,
    value: reminderTexts.weekly
  },
  {
    id: REMINDER_CRON_TYPES.DAYS3,
    value: reminderTexts.days3
  },
]

export const DEFAULT_RESUME_SECTIONS = [
  {
    id: RESUME_SECTION_IDS.INFO,
    enabled: true,
    canbeDisabled: false,
    canbeReorder: false
  },
  {
    id: RESUME_SECTION_IDS.WORK_EXPERIENCE,
    enabled: true,
    canbeDisabled: true,
    canbeReorder: true
  },
  {
    id: RESUME_SECTION_IDS.PERSONAL_PROJECTS,
    enabled: true,
    canbeDisabled: true,
    canbeReorder: true
  },
  {
    id: RESUME_SECTION_IDS.EDUCATIONS,
    enabled: true,
    canbeDisabled: true,
    canbeReorder: true
  },
  {
    id: RESUME_SECTION_IDS.OTHERS,
    enabled: true,
    canbeDisabled: true,
    canbeReorder: true
  }
]

export const validateResumeSection = (section, customModules) => {
  switch (section.id) {
    case RESUME_SECTION_IDS.INFO:
    case RESUME_SECTION_IDS.WORK_EXPERIENCE:
    case RESUME_SECTION_IDS.PERSONAL_PROJECTS:
    case RESUME_SECTION_IDS.EDUCATIONS:
    case RESUME_SECTION_IDS.OTHERS:
      return section
    default:
      if (section.tag !== RESUME_SECTION_IDS.CUSTOM) return null
      if (!customModules.find(module => module.id === section.id)) return null
      return section
  }
}

export const getResumeSectionIntroBySection = (section) => {
  switch (section.id) {
    case RESUME_SECTION_IDS.INFO:
      return {
        title: {
          text: sectionTexts.info.title,
          icon: 'code'
        }
      }
    case RESUME_SECTION_IDS.WORK_EXPERIENCE:
      return {
        title: {
          text: sectionTexts.workExperiences.title,
          icon: 'code'
        }
      }
    case RESUME_SECTION_IDS.PERSONAL_PROJECTS:
      return {
        title: {
          text: sectionTexts.personalProjects.title,
          icon: 'code'
        }
      }
    case RESUME_SECTION_IDS.EDUCATIONS:
      return {
        title: {
          text: sectionTexts.educations.title,
          icon: 'code'
        }
      }
    case RESUME_SECTION_IDS.OTHERS:
      return {
        title: {
          text: sectionTexts.others.title,
          icon: 'code'
        }
      }
    default:
      // TODO: Edward - Can section.title be empty?
      if (!section.title) throw new Error(`unknown section: ${JSON.stringify(section)}`)
      return {
        title: {
          text: `${sectionTexts.custom.title} - ${section.title}`,
          icon: 'code'
        }
      }
  }
}


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
}

export const GENDERS = [
  {
    id: 'male',
    value: genderTexts.male
  },
  {
    id: 'female',
    value: genderTexts.female
  }
]

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
]

export const SOCIAL_LINKS = [
  {
    name: 'github',
    text: 'GitHub',
    icon: 'github.png',
    url: ''
  },
  {
    name: 'segmentfault',
    text: 'Segmentfault',
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
    text: 'Stackoverflow',
    icon: 'stackoverflow.png',
    url: ''
  },
  {
    name: 'xitu',
    text: '稀土掘金',
    icon: 'gold.jpeg',
    url: ''
  },
  {
    name: 'leetcode',
    text: 'LeetCode',
    icon: 'leetcode.png',
    url: ''
  },
  {
    name: 'codewars',
    text: 'Codewars',
    icon: 'codewars.png',
    url: ''
  }
]

export const LINK_NAMES = {
  github: 'GitHub',
  segmentfault: 'Segmentfault',
  blog: '个人博客',
  stackoverflow: 'Stackoverflow',
  xitu: '稀土掘金',
  leetcode: 'LeetCode',
  codewars: 'Codewars',
}

export const INFO = {
  name: '',
  email: '',
  phone: '',
  gender: 'male',
  location: '',
  avator: '',
  intention: '',
  hireAvailable: false,
  privacyProtect: false,
  freshGraduate: false,
  languages: []
}

export const EDU = {
  school: '',
  major: '',
  education: EDUCATIONS[0].id,
  startTime: '',
  endTime: '',
  experiences: [],
}

export const WORK_EXPERIENCE = {
  company: '',
  url: '',
  startTime: '',
  endTime: '',
  position: '',
  projects: []
}

export const WORK_PROJECT = {
  name: '',
  url: '',
  details: []
}

export const PERSONAL_PROJECT = {
  url: '',
  desc: '',
  title: '',
  techs: []
}

export const CUSTOM_SECTION = {
  title: '',
  url: '',
  details: [],
}

export const OTHERS = {
  expectLocation: '',
  expectLocations: [],
  expectSalary: '',
  dream: '',
  supplements: [],
  socialLinks: [...SOCIAL_LINKS]
}

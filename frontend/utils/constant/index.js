import locales from 'LOCALES'
import objectAssign from 'UTILS/object-assign'

const { days, months } = locales('datas')
const tabs = locales('dashboard.tabs')
const githubTexts = locales('github.sections')

const BASE_URL = 'https://github.com'

export const REMOTE_ASSETS = {
  PARTICLES_JS: `${process.env.URI}/vendor/particlesjs-config.json`,
  NOTIFY_ICON: `${process.env.URI}/vendor/images/hacknical-logo-nofity.png`,
  LOGO_ICON: `${process.env.URI}/vendor/images/hacknical-logo.png`
}

export const URLS = {
  GITHUB: BASE_URL,
  REPOSITORY: `${BASE_URL}/ecmadao/hacknical`,
  ISSUE: `${BASE_URL}/ecmadao/hacknical/issues`
}

export const CHART_CONTROLLERS = {
  MONTH: {
    ID: 'monthly',
    FORMAT: 'YYYY-MM',
    TEXT: githubTexts.commits.monthlyView
  },
  WEEK: {
    ID: 'weekly',
    FORMAT: 'YYYY-MM-DD',
    TEXT: githubTexts.commits.weeklyView
  },
  DAY: {
    ID: 'daily',
    FORMAT: 'YYYY-MM-DD',
    TEXT: githubTexts.commits.dailyView
  }
}

export const DEFAULT_REPOSITORIES = 5

export const SECONDS_PER_DAY = 24 * 60 * 60

export const DAYS = [
  days.sunday,
  days.monday,
  days.tuesday,
  days.wednesday,
  days.thursday,
  days.friday,
  days.saturday
]

export const MONTHS = {
  1: months['1'],
  2: months['2'],
  3: months['3'],
  4: months['4'],
  5: months['5'],
  6: months['6'],
  7: months['7'],
  8: months['8'],
  9: months['9'],
  10: months['10'],
  11: months['11'],
  12: months['12']
}

export const OPACITY = {
  max: 1,
  min: 0.3
}

export const USER = {
  login: '',
  id: '',
  avatar_url: '',
  gravatar_id: '',
  url: '',
  html_url: '',
  name: '',
  company: '',
  blog: '',
  location: '',
  email: '',
  hireable: null,
  openShare: true,
  bio: '',
  public_repos: '',
  public_gists: '',
  followers: '',
  following: '',
  created_at: '',
  updated_at: ''
}

export const WECHAT = {
  timeline: '朋友圈',
  groupmessage: '微信群',
  singlemessage: '好友分享'
}

export const TABS = [
  {
    id: 'records',
    name: tabs.records.text,
    icon: 'pie-chart',
    enable: true,
    tipso: tabs.records.tipso
  },
  {
    id: 'archive',
    name: tabs.resume.text,
    icon: 'file-code-o',
    enable: true,
    tipso: tabs.resume.tipso
  },
  {
    id: 'visualize',
    name: tabs.github.text,
    icon: 'github',
    enable: true,
    tipso: tabs.github.tipso
  },
  {
    id: 'setting',
    name: tabs.setting.text,
    icon: 'cog',
    enable: true,
    tipso: tabs.setting.tipso
  }
]

export const MD_COLORS = [
  '#3498db',
  '#2980b9',
  '#2ecc71',
  '#27ae60',
  '#1abc9c',
  '#16a085',
  '#9b59b6',
  '#8e44ad',
  '#34495e',
  '#2c3e50',
  '#f1c40f',
  '#f39c12',
  '#e67e22',
  '#d35400',
  '#e74c3c',
  '#c0392b',
  '#95a5a6',
  '#7f8c8d'
]

export const GREEN_COLORS = [
  'rgba(55, 178, 77, 1)',
  'rgba(55, 178, 77, 0.9)',
  'rgba(55, 178, 77, 0.8)',
  'rgba(55, 178, 77, 0.6)',
  'rgba(55, 178, 77, 0.4)',
  'rgba(55, 178, 77, 0.2)',
  'rgba(55, 178, 77, 0.1)',
]

export const RESUME_TEMPLATES = [
  'v1',
  'v2',
  'v3'
]

export const BASE_URL_REG = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g

export const EMOJI = {
  rocket: '🚀',
  winking: '😉',
  heartEyes: '😍',
  smiling: '😝',
  heart: '\u2764\uFE0F',
  fireworks: '🎉',
  rock: '🤘',
  smile: '😌'
}

export const GITHUB_SECTIONS = {
  HOTMAP: 'hotmap',
  INFO: 'info',
  REPOS: 'repos',
  TIMELINE: 'course',
  LANGUAGES: 'languages',
  ORGS: 'orgs',
  CONTRIBUTIONS: 'contributed',
  COMMITS: 'commits'
}

export const DEFAULT_GITHUB_SECTIONS = [
  {
    id: GITHUB_SECTIONS.HOTMAP,
    enabled: true
  },
  {
    id: GITHUB_SECTIONS.INFO,
    enabled: true
  },
  {
    id: GITHUB_SECTIONS.REPOS,
    enabled: true
  },
  {
    id: GITHUB_SECTIONS.TIMELINE,
    enabled: true
  },
  {
    id: GITHUB_SECTIONS.LANGUAGES,
    enabled: true
  },
  {
    id: GITHUB_SECTIONS.ORGS,
    enabled: true
  },
  {
    id: GITHUB_SECTIONS.CONTRIBUTIONS,
    enabled: true
  },
  {
    id: GITHUB_SECTIONS.COMMITS,
    enabled: true
  }
]

export const getGitHubSectionDefaultDataById = (sectionId) => {
  switch (sectionId) {
    case GITHUB_SECTIONS.HOTMAP:
      return {
        start: null,
        end: null,
        datas: null,
        total: null,
        streak: null
      }
    case GITHUB_SECTIONS.INFO:
      return objectAssign({}, USER)
    case GITHUB_SECTIONS.REPOS:
      return {
        ownedRepositories: [],
        forkedRepositories: [],
        commitDatas: []
      }
    case GITHUB_SECTIONS.TIMELINE:
      return {
        repositories: [],
        commitDatas: []
      }
    case GITHUB_SECTIONS.LANGUAGES:
      return {
        languages: {},
        languageUsed: {},
        languageSkills: {},
        languageDistributions: {},
        repositories: []
      }
    case GITHUB_SECTIONS.ORGS:
    case GITHUB_SECTIONS.CONTRIBUTIONS:
      return null
    case GITHUB_SECTIONS.COMMITS:
      return {
        commitDatas: [],
        commitInfos: {
          dailyCommits: [],
          total: 0,
          commits: []
        },
      }
    default:
      throw new Error(`unknown section id: ${sectionId}`)
  }
}

export const getGitHubSectionIntroById = (sectionId) => {
  switch (sectionId) {
    case GITHUB_SECTIONS.HOTMAP:
      return {
        title: {
          text: githubTexts.hotmap.title,
          icon: 'cloud-upload'
        },
        intro: {
          icon: 'question-circle',
          text: githubTexts.hotmap.tipso
        }
      }
    case GITHUB_SECTIONS.INFO:
      return {
        title: {
          text: githubTexts.baseInfo.title,
          icon: 'vcard-o'
        }
      }
    case GITHUB_SECTIONS.REPOS:
      return {
        title: {
          text: githubTexts.repos.title,
          icon: 'bar-chart'
        }
      }
    case GITHUB_SECTIONS.TIMELINE:
      return {
        title: {
          text: githubTexts.course.title,
          icon: 'trophy'
        },
        intro: {
          icon: 'question-circle',
          text: githubTexts.course.tipso
        }
      }
    case GITHUB_SECTIONS.LANGUAGES:
      return {
        title: {
          text: githubTexts.languages.title,
          icon: 'code'
        }
      }
    case GITHUB_SECTIONS.ORGS:
      return {
        title: {
          text: githubTexts.orgs.title,
          icon: 'rocket'
        },
        intro: {
          icon: 'question-circle',
          text: githubTexts.orgs.tipso
        }
      }
    case GITHUB_SECTIONS.CONTRIBUTIONS:
      return {
        title: {
          text: githubTexts.contributed.title,
          icon: 'plug'
        },
        intro: {
          icon: 'question-circle',
          text: githubTexts.contributed.tipso
        }
      }
    case GITHUB_SECTIONS.COMMITS:
      return {
        title: {
          text: githubTexts.commits.title,
          icon: 'git'
        },
        intro: {
          icon: 'question-circle',
          text: githubTexts.commits.tipso
        }
      }
    default:
      throw new Error(`unknown section id: ${sectionId}`)
  }
}

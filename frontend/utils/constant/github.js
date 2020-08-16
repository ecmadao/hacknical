
import locales from 'LOCALES'
import objectAssign from 'UTILS/object-assign'

const githubTexts = locales('github.sections')

const BASE_URL = 'https://github.com'

export const DEFAULT_REPOSITORIES = 5

export const URLS = {
  GITHUB: BASE_URL,
  REPOSITORY: `${BASE_URL}/ecmadao/hacknical`,
  ISSUE: `${BASE_URL}/ecmadao/hacknical/issues`
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

export const getGitHubSectionIntroBySection = (section) => {
  switch (section.id) {
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
      if (!section.title) throw new Error(`unknown section: ${JSON.stringify(section)}`)
  }
}

import locales from 'LOCALES'

const { days, months } = locales('datas')
const tabs = locales('dashboard.tabs')
const githubTexts = locales('github.sections')

export const REMOTE_ASSETS = {
  PARTICLES_JS: `${process.env.URI}/vendor/particlesjs-config.json`,
  NOTIFY_ICON: `${process.env.URI}/vendor/images/hacknical-logo-nofity.png`,
  LOGO_ICON: `${process.env.URI}/vendor/images/hacknical-logo.png`
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

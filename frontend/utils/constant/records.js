import locales from 'LOCALES'

const recordsTexts = locales('dashboard.records')

export const LOGS_COUNT = 30

export const VIEW_TYPES = {
  HOURLY: {
    ID: 'hourly',
    TEXT: recordsTexts.common.hourlyViewChartTitle,
    SHORT: recordsTexts.common.hourlyViewChart,
    FORMAT: 'YYYY-MM-DD HH:00'
  },
  DAILY: {
    ID: 'daily',
    TEXT: recordsTexts.common.dailyViewChartTitle,
    SHORT: recordsTexts.common.dailyViewChart,
    FORMAT: 'YYYY-MM-DD'
  },
  MONTHLY: {
    ID: 'monthly',
    TEXT: recordsTexts.common.monthlyViewChartTitle,
    SHORT: recordsTexts.common.monthlyViewChart,
    FORMAT: 'YYYY-MM'
  }
}

export const RECORDS_SECTIONS = {
  RESUME: {
    ID: 'RESUME',
    TEXT: recordsTexts.resume.title
  },
  GITHUB: {
    ID: 'GITHUB',
    TEXT: recordsTexts.github.title
  }
}

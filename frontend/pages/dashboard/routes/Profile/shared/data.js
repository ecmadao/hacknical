import locales from 'LOCALES';

const profileTexts = locales('dashboard').profile;

export const VIEW_TYPES = {
  HOURLY: {
    ID: 'hourly',
    TEXT: profileTexts.common.hourlyViewChartTitle,
    SHORT: profileTexts.common.hourlyViewChart,
  },
  DAILY: {
    ID: 'daily',
    TEXT: profileTexts.common.dailyViewChartTitle,
    SHORT: profileTexts.common.dailyViewChart,
  },
  MONTHLY: {
    ID: 'monthly',
    TEXT: profileTexts.common.monthlyViewChartTitle,
    SHORT: profileTexts.common.monthlyViewChart,
  },
};

export const PROFILE_SECTIONS = [
  {
    id: 'resume',
    text: profileTexts.resume.title
  },
  {
    id: 'github',
    text: profileTexts.github.title
  }
];

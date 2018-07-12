import locales from 'LOCALES';

const { days, months } = locales('datas');
const { tabs } = locales('dashboard');

export const DAYS = [
  days.sunday,
  days.monday,
  days.tuesday,
  days.wednesday,
  days.thursday,
  days.friday,
  days.saturday
];

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
};

export const OPACITY = {
  max: 1,
  min: 0.3
};

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
};

export const WECHAT = {
  timeline: '朋友圈',
  groupmessage: '微信群',
  singlemessage: '好友分享'
};

export const TABS = [
  {
    id: 'records',
    name: tabs.records.text,
    icon: 'fa-pie-chart',
    enable: true,
    tipso: tabs.records.tipso
  },
  {
    id: 'archive',
    name: tabs.resume.text,
    icon: 'fa-file-code-o',
    enable: true,
    tipso: tabs.resume.tipso
  },
  {
    id: 'visualize',
    name: tabs.github.text,
    icon: 'fa-github',
    enable: true,
    tipso: tabs.github.tipso
  },
  {
    id: 'setting',
    name: tabs.setting.text,
    icon: 'fa-cog',
    enable: true,
    tipso: tabs.setting.tipso
  }
];

import locales from 'LOCALES';
const tabs = locales('dashboard').tabs;

const TABS = [
  {
    id: 'profile',
    name: tabs.profile,
    icon: 'fa-user-circle',
    enable: true,
  },
  {
    id: 'resume',
    name: tabs.resume,
    enable: true,
    icon: 'fa-file-code-o'
  },
  {
    id: 'github',
    name: tabs.github,
    icon: 'fa-github',
    enable: true
  },
  {
    id: 'setting',
    name: tabs.setting,
    icon: 'fa-cog',
    enable: true
  }
];

export default TABS;

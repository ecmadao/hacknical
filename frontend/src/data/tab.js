import locales from 'LOCALES';
const tabs = locales('dashboard').tabs;

const TABS = [
  {
    id: 'profile',
    name: tabs.profile.text,
    icon: 'fa-user-circle',
    enable: true,
    tipso: tabs.profile.tipso
  },
  {
    id: 'resume',
    name: tabs.resume.text,
    icon: 'fa-file-code-o',
    enable: true,
    tipso: tabs.resume.tipso
  },
  {
    id: 'github',
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

export default TABS;

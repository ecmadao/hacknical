import locales from 'LOCALES';

const { tabs } = locales('dashboard');

const TABS = [
  {
    id: 'records',
    name: tabs.records.text,
    icon: 'fa-user-circle',
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

export default TABS;

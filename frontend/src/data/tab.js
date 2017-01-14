import { GREEN_COLORS, BLUE_COLORS } from 'UTILS/colors';

const TABS = [
  {
    id: 'profile',
    name: '用户信息',
    icon: 'fa-user-circle',
    enable: false,
    activeStyle: {
    }
  },
  {
    id: 'resume',
    name: '简历',
    enable: true,
    icon: 'fa-file-text-o'
  },
  {
    id: 'github',
    name: 'github',
    icon: 'fa-github',
    enable: true,
    activeStyle: {
      // color: GREEN_COLORS[0],
      borderBottom: `3px solid ${GREEN_COLORS[0]}`
    }
  },
  {
    id: 'setting',
    name: '设置',
    icon: 'fa-cog',
    enable: false,
    activeStyle: {
    }
  }
];

export default TABS;

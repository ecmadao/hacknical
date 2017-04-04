import { GITHUB_SECTIONS } from '../utils/datas';

export const getMobileMenu = (__) => {
  const menu = {
    shareDatas: __("mobilePage.menu.shareDatas"),
    githubAnalysis: __("mobilePage.menu.githubAnalysis"),
    dataRefresh: __("mobilePage.menu.dataRefresh"),
    logout: __("mobilePage.menu.logout"),
  };
  return menu;
};

export const getGithubSections = (datas) => {
  let githubSections = {};
  Object.keys(datas).forEach((key) => {
    if (GITHUB_SECTIONS.some(section => section === key)) {
      githubSections[key] = body[key];
    }
  });
  return githubSections;
};

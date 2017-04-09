import { GITHUB_SECTIONS } from '../utils/datas';

export const getMobileMenu = (ctx) => ({
  shareDatas: ctx.__("mobilePage.menu.shareDatas"),
  githubShare: ctx.__("mobilePage.menu.githubShare"),
  resumeShare: ctx.__("mobilePage.menu.resumeShare"),
  dataRefresh: ctx.__("mobilePage.menu.dataRefresh"),
  logout: ctx.__("mobilePage.menu.logout")
});

export const getGithubSections = (datas) => {
  let githubSections = {};
  Object.keys(datas).forEach((key) => {
    if (GITHUB_SECTIONS.some(section => section === key)) {
      githubSections[key] = datas[key];
    }
  });
  return githubSections;
};

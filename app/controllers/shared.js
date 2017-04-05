import { GITHUB_SECTIONS } from '../utils/datas';

export const getMobileMenu = (ctx) => ({
  shareDatas: ctx.__("mobilePage.menu.shareDatas"),
  githubAnalysis: ctx.__("mobilePage.menu.githubAnalysis"),
  dataRefresh: ctx.__("mobilePage.menu.dataRefresh"),
  logout: ctx.__("mobilePage.menu.logout")
});

export const getGithubSections = (datas) => {
  let githubSections = {};
  Object.keys(datas).forEach((key) => {
    if (GITHUB_SECTIONS.some(section => section === key)) {
      githubSections[key] = body[key];
    }
  });
  return githubSections;
};

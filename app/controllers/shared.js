
import { GITHUB_SECTIONS } from '../utils/datas';

export const getGithubSections = (datas) => {
  const githubSections = {};
  const set = new Set(GITHUB_SECTIONS);
  Object.keys(datas).forEach((key) => {
    if (set.has(key)) {
      githubSections[key] = datas[key];
    }
  });
  return githubSections;
};

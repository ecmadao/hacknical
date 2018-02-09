import { getData, putData, patchData } from './base';

const getResume = () => getData('/resume/edit');

const setResume = resume =>
  putData('/resume/edit', { resume });

const download = (hash = window.resumeHash) =>
  getData('/resume/download', { hash });

const getPubResume = hash => getData('/resume/pub', { hash });
const getPubResumeHash = login => getData('/resume/hash', { login });
const getPubResumeStatus = (hash) => {
  if (hash) {
    return getData(`/resume/${hash}/share`);
  }
  return getData('/resume/share');
};

const patchHireAvailable = hireAvailable =>
  patchData('/resume/hireAvailable', { hireAvailable });

const postPubResumeShareStatus = enable =>
  patchData('/resume/share/status', { enable });

const togglePubResumeSimplifyUrl = simplifyUrl =>
  patchData('/resume/shareUrl', { simplifyUrl });

const postPubResumeGithubStatus = enable =>
  patchData('/resume/share/github', { enable });

const postPubResumeGithubSection = option =>
  patchData('/resume/github/section', option);

const postPubResumeTemplate = template =>
  patchData('/resume/share/template', { template });

const getShareRecords = () =>
  getData('/resume/share/records');

export default {
  getResume,
  setResume,
  download,
  getPubResume,
  getPubResumeHash,
  getPubResumeStatus,
  postPubResumeShareStatus,
  togglePubResumeSimplifyUrl,
  postPubResumeGithubStatus,
  postPubResumeGithubSection,
  postPubResumeTemplate,
  getShareRecords,
  patchHireAvailable,
};

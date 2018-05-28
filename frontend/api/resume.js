import { getData, putData, patchData } from './base';

const getResume = () => getData('/resume');
const setResume = resume => putData('/resume', { resume });
const patchResume = data => patchData('/resume', { data });

const download = () => getData('/resume/download');

const getPubResume = hash => getData('/resume/shared/public', { hash });

const getResumeInfo = (options = {}) => {
  const { hash, userId } = options;
  const qs = {};
  if (hash) qs.hash = hash;
  if (userId) qs.userId = userId;
  return getData('/resume/info', qs);
};

const patchResumeInfo = info => patchData('/resume/info', { info });
const patchResumeReminder = reminder => patchData('/resume/reminder', { reminder });

const getShareRecords = () => getData('/resume/records');

export default {
  getResume,
  setResume,
  patchResume,
  // =================================
  download,
  getPubResume,
  patchResumeInfo,
  patchResumeReminder,
  getResumeInfo,
  getShareRecords,
};

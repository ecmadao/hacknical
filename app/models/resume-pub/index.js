import shortid from 'shortid';
import ResumePub from './schema';
import Resume from '../resumes';
import ShareAnalyse from '../share-analyse';
import dateHelper from '../../utils/date';

const { getSeconds, getDateAfterDays } = dateHelper;

const createResumeShare = async (options = {}) => {
  await ShareAnalyse.createShare(options);
};

const findPublicResumes = async (options = {}) =>
  await ResumePub.find(options);

const findByHash = async hash =>
  await findPublicResume({
    $or: [
      { resumeHash: hash },
      { resumeHashV0: hash },
    ]
  });

const findPublicResume = async (options) => {
  const findResult = await ResumePub.findOne(options);
  if (!findResult) {
    return { success: false, };
  }
  return {
    success: true,
    result: findResult
  };
};

const addPubResume = async (userId, login, options = {}) => {
  const timestamp = getSeconds(getDateAfterDays(options.days || 10));
  const maxView = options.maxView || 500;
  const resumeHash = shortid.generate();

  await createResumeShare({
    userId,
    url: `${login}/resume`
  });

  const saveResult = await ResumePub.create({
    userId,
    timestamp,
    maxView,
    resumeHash
  });

  if (saveResult) {
    return {
      success: true,
      result: saveResult
    };
  }
  return {
    success: false,
    result: null
  };
};

const updatePubResume = async (userId, options) => {
  const findResult = await findPublicResume({ userId });
  const { result, success } = findResult;
  if (!success) {
    return findResult;
  }
  Object.assign(result, options);

  await result.save();

  return { success: true };
};

const checkResumeShare = async (hash, verify = {}) => {
  const findResult = await findByHash(hash);
  if (!findResult.success) { return findResult; }
  const { userId } = findResult.result;

  let { openShare } = findResult.result;
  if ((verify.userId && verify.userId === userId) || verify.enable) {
    openShare = true;
  }
  if (!openShare) {
    return { success: false };
  }
  return { success: true };
};

const getPubResumeInfo = async (hash) => {
  const findResult = await findByHash(hash);
  if (!findResult.success) return findResult;
  const { userId, resumeHash } = findResult.result;

  const findResume = await Resume.findOne(userId);
  if (!findResume.success) return findResume;

  return {
    success: true,
    result: {
      userId,
      resumeHash,
      name: findResume.result.info.name,
    }
  };
};

const getUpdateTime = async (resumeHash) => {
  const findResult = await findByHash(resumeHash);
  const { result, success } = findResult;
  if (!success) return findResult;

  const { userId } = result;
  return await Resume.getUpdateTime(userId);
};

const getPubResume = async (resumeHash) => {
  const findResult = await findByHash(resumeHash);
  const { result, success } = findResult;
  if (!success) { return findResult; }
  const { userId } = result;
  return await Resume.findOne(userId);
};

const deletePubResume = async (userId, resumeHash) => {
  await ResumePub.remove({ userId, resumeHash });
  return { success: true };
};

const clearPubResume = async (userId) => {
  await ResumePub.remove({ userId });
  return { success: true };
};

export default {
  addPubResume,
  updatePubResume,
  deletePubResume,
  clearPubResume,
  getPubResume,
  getUpdateTime,
  getPubResumeInfo,
  checkResumeShare,
  findByHash,
  find: findPublicResumes,
  findOne: findPublicResume,
};

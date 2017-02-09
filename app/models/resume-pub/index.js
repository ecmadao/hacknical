import crypto from 'crypto';

import ResumePub from './schema';
import Resume from '../resumes/index';
import dateHelper from '../../utils/date';

const { getSeconds, getDateAfterDays } = dateHelper;

const getResumeHash = (userId) => {
  const salt = crypto.randomBytes(8).toString('base64');
  const bytes = new Buffer(userId || '', 'utf16le');
  const src = new Buffer(salt || '', 'base64');
  const dst = new Buffer(src.length + bytes.length);

  src.copy(dst, 0, 0, src.length);
  bytes.copy(dst, src.length, 0, bytes.length);

  return crypto.createHash('sha1').update(dst).digest('base64');
};

const resumeValidation = (timestamp) => {
  const secondsNow = getSeconds();
  if(secondsNow > timestamp) {
    return false;
  }
  return true;
};

const findPublicResume = async (options) => {
  const findResult = await ResumePub.findOne(options);
  if (!findResult) {
    return Promise.resolve({
      success: false,
      message: '没有找到指定简历'
    });
  }
  return Promise.resolve({
    success: true,
    result: findResult
  });
};

const addPubResume = async (userId, options) => {
  const findResule = await Resume.getResume(userId);
  if (!findResule.success) {
    return Promise.resolve({
      success: false,
      message: '尚未创建简历'
    });
  }
  const timestamp = getSeconds(getDateAfterDays(options.days || 10));
  const maxView = options.maxView || 500;
  const resumeHash = getResumeHash(userId);

  const saveResult = await ResumePub.create({
    userId,
    timestamp,
    maxView,
    resumeHash
  });

  if (saveResult) {
    return Promise.resolve({
      success: true,
      message: '创建成功',
      result: resumeHash
    });
  }
  return Promise.resolve({
    success: false,
    message: '创建失败'
  });
};

const updatePubResume = async (userId, resumeHash, options) => {
  const findResult = await findPublicResume({ userId, resumeHash });
  const { result, success } = findResult;
  if (!success) {
    return findResult;
  }

  Object.keys(options).forEach((key) => {
    result[key] = options[key];
  });
  await result.save();

  return Promise.resolve({
    success: true
  });
};

const checkPubResume = async (resumeHash) => {
  const findResult = await findPublicResume({ resumeHash });
  if (!findResult.success) { return findResult; }
  const { userId } = findResult.result;

  const findResume = await Resume.getResume(userId);
  if (!findResume.success) { return findResume }

  return Promise.resolve({
    success: true,
    result: findResume.result.info.name
  });
};

const getPubResume = async (resumeHash) => {
  const findResult = await findPublicResume({ resumeHash });
  const { result, success } = findResult;
  if (!success) {
    return findResult;
  }

  const { timestamp, resumeId, maxView, userId, openShare } = result;

  if (!openShare) {
    return Promise.resolve({
      success: false,
      message: '用户已关闭分享'
    });
  }

  // if (!maxView) {
  //   await deletePubResume(userId, resumeHash);
  //   return Promise.resolve({
  //     success: false,
  //     message: '已超过最大查看次数'
  //   });
  // }
  //
  // if (!resumeValidation(timestamp)) {
  //   await deletePubResume(userId, resumeHash);
  //   return Promise.resolve({
  //     success: false,
  //     message: '已过期'
  //   });
  // }

  return await Resume.getResume(userId);
};

const deletePubResume = async (userId, resumeHash) => {
  await ResumePub.remove({ userId, resumeHash });
  return Promise.resolve({
    success: true
  });
};

const clearPubResume = async (userId) => {
  await ResumePub.remove({ userId });
  return Promise.resolve({
    success: true
  });
};


export default {
  addPubResume,
  updatePubResume,
  deletePubResume,
  clearPubResume,
  getPubResume,
  checkPubResume
}

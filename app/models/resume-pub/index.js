import crypto from 'crypto';

import ResumePub from './schema';
import Resume from '../resumes/index';
import dateHelper from '../../utils/date';

const { getSeconds, getDateAfterDays } = dateHelper;

const getResumeHash = (resumeId) => {
  const salt = crypto.randomBytes(8).toString('base64');
  const bytes = new Buffer(resumeId || '', 'utf16le');
  const src = new Buffer(salt || '', 'base64');
  const dst = new Buffer(src.length + bytes.length);

  src.copy(dst, 0, 0, src.length);
  bytes.copy(dst, src.length, 0, bytes.length);

  return crypto.createHash('sha1').update(dst).digest('base64');
}

const resumeValidation = (timestamp) => {
  const secondsNow = getSeconds();
  if(secondsNow > timestamp) {
    return false;
  }
  return true;
};

const findPublicResume = async (userId, resumeHash) => {
  return await ResumePub.findOne({
    userId,
    resumeHash
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
  const resumeObj = findResule.result;
  const resumeId = resumeObj._id;
  const timestamp = getSeconds(getDateAfterDays(options.days || 10));
  const maxView = options.maxView || 100;
  const resumeHash = getResumeHash(resumeId);

  const saveResult = await ResumePub.create({
    resumeId,
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
  const findResult = await findPublicResume(userId, resumeHash);
  if (!findResult) {
    return Promise.resolve({
      success: false,
      message: '没有找到指定简历'
    });
  }

  Object.keys(options).forEach((key) => {
    findResult[key] = options[key];
  });
  await findResult.save();

  return Promise.resolve({
    success: true
  });
};

const findPubResume = async (userId, resumeHash) => {
  const findResult = await findPublicResume(userId, resumeHash);
  if (!findResult) {
    return Promise.resolve({
      success: false,
      message: '没有找到指定简历'
    });
  }

  const { timestamp, resumeId, maxView } = findResult;

  if (!maxView) {
    await deletePubResume(userId, resumeHash);
    return Promise.resolve({
      success: false,
      message: '已超过最大查看次数'
    });
  }

  if (!resumeValidation(timestamp)) {
    await deletePubResume(userId, resumeHash);
    return Promise.resolve({
      success: false,
      message: '已过期'
    });
  }

  return await Resume.getPubResume(userId, resumeId);
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
  findPubResume
}

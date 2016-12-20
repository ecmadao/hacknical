import Resume from './schema';
import { DEFAULT_RESUME } from '../../utils/resume';

const initialResume = async (userId, options) => {
  const newResume = Object.assign({}, DEFAULT_RESUME);
  newResume.info.name = options.name || '';
  newResume.info.email = options.email || '';
  return await addResume(userId, newResume);
};

const addResume = async (userId, resume = DEFAULT_RESUME) => {
  const addResult = await Resume.create({
    userId,
    resume
  });
  if (addResult) {
    return Promise.resolve({
      success: true,
      message: '新增简历成功',
      result: addResult
    });
  }
  return Promise.resolve({
    success: false,
    message: '新增简历成功',
    result: null
  });
};

const updateResume = async (userId, resume) => {
  await Resume.remove({ userId });
  return await addResume(userId, resume);
};

const getResume = async (userId) => {
  const getResult = await Resume.findOne({ userId });
  if (!getResult) {
    return Promise.resolve({
      success: false,
      message: '没有查询到结果',
      result: {}
    });
  }
  return Promise.resolve({
    success: true,
    message: '',
    result: getResult.resume
  });
};

const getPubResume = async (userId, resumeId) => {
  const getResult = await Resume.findOne({
    userId,
    _id: resumeId
  });
  if (!getResult) {
    return Promise.resolve({
      success: false,
      message: '没有查询到结果',
      result: {}
    });
  }
  return Promise.resolve({
    success: true,
    message: '',
    result: getResult.resume
  });
};

const removeAll = async () => {
  await Resume.remove();
};

export default {
  initialResume,
  addResume,
  getResume,
  getPubResume,
  updateResume,
  removeAll
}

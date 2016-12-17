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
  return Promise.resolve({
    success: true,
    message: '新增简历成功',
    result: addResult
  });
};

const updateResume = async (userId, resume) => {
  const updateResult = await Resume.update({ userId }, resume);
  return Promise.resolve({
    success: true,
    message: '简历更新成功',
    result: updateResult
  });
};

const getResume = async (userId) => {
  const getResult = await Resume.findOne({ userId: userId });
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
  updateResume,
  removeAll
}

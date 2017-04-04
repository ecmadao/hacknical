import Resume from './schema';
import { DEFAULT_RESUME } from '../../utils/resume';

const initialResume = async (userId, options) => {
  const newResume = Object.assign({}, DEFAULT_RESUME);
  newResume.info.name = options.name || '';
  newResume.info.email = options.email || '';
  return await addResume(userId, newResume);
};

const findResume = async (options) => {
  return await Resume.findOne(options);
};

const addResume = async (userId, resume = DEFAULT_RESUME) => {
  const addResult = await Resume.create({
    userId,
    resume
  });
  return Promise.resolve({
    success: addResult ? true : false,
    message: '新增简历成功',
    result: addResult || null
  });
};

const updateResume = async (userId, resume) => {
  await Resume.remove({ userId });
  return await addResume(userId, resume);
};

const getUpdateTime = async (userId) => {
  const getResult = await findResume({ userId });
  return Promise.resolve({
    success: getResult ? true : false,
    message: '',
    result: getResult ? getResult.updated_at : ''
  });
};

const getResume = async (userId) => {
  const getResult = await findResume({ userId });
  return Promise.resolve({
    success: getResult ? true : false,
    message: getResult ? '' : '没有查询到结果',
    result: getResult ? getResult.resume : null
  });
};

const removeAll = async () => {
  await Resume.remove();
};

export default {
  initialResume,
  addResume,
  getResume,
  getUpdateTime,
  updateResume,
  removeAll
}

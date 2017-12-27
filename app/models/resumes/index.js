import Resume from './schema';
import { mergeObject } from '../../utils/helper';
import { DEFAULT_RESUME } from '../../utils/datas';

const addResume = async (userId, resume = DEFAULT_RESUME) => {
  const addResult = await Resume.create({
    userId,
    resume
  });
  return {
    success: addResult,
    result: addResult || null
  };
};

const initialResume = async (userId, options) => {
  const newResume = Object.assign({}, DEFAULT_RESUME);
  newResume.info.name = options.name || '';
  newResume.info.email = options.email || '';
  return await addResume(userId, newResume);
};

const findResume = async options =>
  await Resume.findOne(options);

const findResumes = async options =>
  await Resume.find(options);

const update = async (options) => {
  const {
    target,
    userId
  } = options;
  const resume = await findResume({ userId });
  mergeObject(resume, target);
  await resume.save();
};

const reset = async (userId, resume, cache) => {
  const findResult = await findResume({ userId });
  if (!findResult) {
    cache.hincrby('resume', 'count', 1);
  }
  await Resume.remove({ userId });
  return await addResume(userId, resume);
};

const getUpdateTime = async (userId) => {
  const getResult = await findResume({ userId });
  return {
    success: getResult,
    message: '',
    result: getResult ? getResult.updated_at : ''
  };
};

const getResume = async (userId) => {
  const getResult = await findResume({ userId });
  if (!getResult) {
    return {
      success: false,
      result: null
    };
  }
  const { resume, updated_at } = getResult;
  const {
    info,
    others,
    educations,
    workExperiences,
    personalProjects
  } = resume;
  return {
    success: true,
    result: {
      info,
      others,
      educations,
      workExperiences,
      personalProjects,
      updateAt: updated_at
    }
  };
};

const findAll = async () => await Resume.find({});

export default {
  reset,
  update,
  findAll,
  initialResume,
  getUpdateTime,
  find: findResumes,
  findOne: getResume,
};

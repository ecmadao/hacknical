import Resume from '../models/resumes';

const getResume = async (ctx, next) => {
  const userId = ctx.session.userId;
  const getResult = await Resume.getResume(userId);
  const { message, result } = getResult;
  ctx.body = {
    success: true,
    result
  };
};

const setResume = async (ctx, next) => {
  const { resume } = ctx.query;
  const resumeObj = JSON.parse(resume);
  const userId = ctx.session.userId;

  const setResult = await Resume.updateResume(userId, resumeObj);
  const { success, result } = setResult;
  ctx.body = {
    message: '储存成功',
    success,
    result
  };
};

export default {
  getResume,
  setResume
}

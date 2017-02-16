import Resume from '../models/resumes';
import ResumePub from '../models/resume-pub';
import ShareAnalyse from '../models/share-analyse';

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
  const { userId } = ctx.session;

  const setResult = await Resume.updateResume(userId, resumeObj);
  let resumeInfo = null;
  if (setResult.success) {
    // check & add resume share info
    let checkResult = await ResumePub.findPublicResume({ userId });
    if (!checkResult.success) {
      checkResult = await ResumePub.addPubResume(userId);
    }
    resumeInfo = checkResult.success ? {
      url: `resume/${checkResult.result.resumeHash}`,
      useGithub: checkResult.result.useGithub,
      openShare: checkResult.result.openShare
    } : null;
  }

  ctx.body = {
    success: true,
    message: '储存成功',
    result: resumeInfo
  };
};

const getPubResume = async (ctx, next) => {
  const { hash } = ctx.params;
  const findResume = await ResumePub.getPubResume(hash);
  const { success, result, message } = findResume;

  ctx.body = {
    message,
    result,
    success: true
  };
};

const getPubResumePage = async (ctx, next) => {
  const { hash } = ctx.params;
  const findResume = await ResumePub.checkPubResume({
    resumeHash: hash
  });
  const { success, result } = findResume;
  if (!success) {
    ctx.redirect('/404');
    return;
  }

  await ctx.render('resume/share', {
    title: `${result}的个人简历`,
    resumeHash: hash
  });
};

const getResumeStatus = async (ctx, next) => {
  const { userId } = ctx.session;
  const findPubResume = await ResumePub.findPublicResume({ userId });
  const { result, success, message } = findPubResume;
  if (!success) {
    ctx.body = {
      error: message,
      success: true,
      result: null
    };
    return
  }

  const { useGithub, resumeHash, openShare } = result;
  ctx.body = {
    success: true,
    result: {
      openShare,
      useGithub,
      url: `resume/${resumeHash}`
    }
  }
};

const setResumeShareStatus = async (ctx, next) => {
  const { enable } = ctx.query;
  const { userId } = ctx.session;
  const findPubResume = await ResumePub.findPublicResume({ userId });
  const { result, success, message } = findPubResume;
  if (!success) {
    ctx.body = {
      error: message,
      success: true
    };
    return
  }
  await ResumePub.updatePubResume(userId, result.resumeHash, {
    openShare: enable
  });
  const text = enable === 'true' ? '开启' : '关闭';
  ctx.body = {
    success: true,
    message: `分享链接已${text}`
  };
};

const setResumeGithubStatus = async (ctx, next) => {
  const { enable } = ctx.query;
  const { userId } = ctx.session;
  const findPubResume = await ResumePub.findPublicResume({ userId });
  const { result, success, message } = findPubResume;
  if (!success) {
    ctx.body = {
      error: message,
      success: true
    };
    return
  }
  await ResumePub.updatePubResume(userId, result.resumeHash, {
    useGithub: enable
  });
  const text = enable === 'true' ? '开启' : '关闭';
  ctx.body = {
    success: true,
    message: `已${text}简历和 github 的关联`
  };
};

const getShareData = async (ctx, next) => {
  const { userId } = ctx.session;
  const findPubResume = await ResumePub.findPublicResume({ userId });
  const { result, success, message } = findPubResume;
  if (!success) {
    ctx.body = {
      error: message,
      success: true,
      result: {
        url: '',
        viewDevices: [],
        viewSources: [],
        pageViews: [],
        openShare: false
      }
    };
    return;
  }

  const shareAnalyse = await ShareAnalyse.findShare({ url: `resume/${result.resumeHash}`, userId });
  const { viewDevices, viewSources, pageViews } = shareAnalyse;
  ctx.body = {
    success: true,
    result: {
      url: `resume/${result.resumeHash}`,
      openShare: result.openShare,
      viewDevices,
      viewSources,
      pageViews,
    }
  };
};

export default {
  getResume,
  setResume,
  getPubResume,
  getPubResumePage,
  getResumeStatus,
  setResumeShareStatus,
  setResumeGithubStatus,
  getShareData
}

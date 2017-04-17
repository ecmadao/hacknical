import ShareAnalyse from '../../models/share-analyse';
import ResumePub from '../../models/resume-pub';
import getValue from '../../utils/helper';

const githubEnable = (key = 'params.login') => async (ctx, next) => {
  const login = getValue(ctx, key);
  const { githubLogin } = ctx.session;
  if (login !== githubLogin) {
    const shareAnalyse = await ShareAnalyse.findShare({ login, url: `github/${login}` });
    if (!shareAnalyse || !shareAnalyse.enable) {
      return ctx.redirect('/404');
    }
  }
  await next();
};

const resumeEnable = (key = 'params.hash') => async (ctx, next) => {
  const targetUserId = ctx.query.userId;
  const userId = targetUserId || ctx.session.userId;
  if (targetUserId) { ctx.session.fromDownload = true; }

  const enable = ctx.session.fromDownload;
  const resumeHash = getValue(ctx, key);
  const findResume = await ResumePub.checkResumeShare({ resumeHash }, { userId, enable });
  if (!findResume.success) {
    return ctx.redirect('/404');
  }
  await next();
};

export default {
  githubEnable,
  resumeEnable
};

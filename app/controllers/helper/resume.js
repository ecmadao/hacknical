import User from '../../models/users';
import ResumePub from '../../models/resume-pub';
import { getValue } from '../../utils/helper';

const checkValidateByLogin = (key = 'query.login') => async (ctx, next) => {
  const login = getValue(ctx, key);
  const user = await User.findUserByLogin(login);
  if (!user) return ctx.redirect('/404');

  const { githubLogin } = ctx.session;
  const { userId } = user;
  const option = { userId };
  if (login !== githubLogin) {
    option.openShare = true;
  }
  const { result, success } = await ResumePub.findOne(option);
  if (!success && login !== githubLogin) return ctx.redirect('/404');

  ctx.query.hash = success ? result.resumeHash : null;
  await next();
};

const checkValidateByHash = (key = 'params.hash') => async (ctx, next) => {
  const targetUserId = ctx.query.userId;
  const userId = targetUserId || ctx.session.userId;
  if (targetUserId) { ctx.session.fromDownload = true; }

  const enable = ctx.session.fromDownload;
  const resumeHash = getValue(ctx, key);
  const findResume = await ResumePub.checkResumeShare(resumeHash, { userId, enable });
  if (!findResume.success) {
    return ctx.redirect('/404');
  }
  await next();
};

export default {
  checkValidateByHash,
  checkValidateByLogin,
};

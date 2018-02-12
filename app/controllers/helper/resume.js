import ResumePub from '../../models/resume-pub';
import { getValue } from '../../utils/helper';

const toggleLoginShare = (key = 'request.body.simplifyUrl') => async (ctx, next) => {
  const simplifyUrl = getValue(ctx, key);
  const { githubLogin, userId } = ctx.session;
  await ResumePub.updatePubResume(userId, {
    simplifyUrl
  });
  const findResult = await ResumePub.findOne({ userId });
  if (!simplifyUrl || !findResult.success || !findResult.result.openShare) {
    await ctx.cache.hdel('share-resume-login', githubLogin);
  } else {
    const { openShare, resumeHash } = findResult.result;
    await ctx.cache.hset('share-resume-login', githubLogin, JSON.stringify({
      userId,
      openShare,
      resumeHash,
    }));
  }
  await next();
};

const toggleHashShare = (key = 'request.body.enable') => async (ctx, next) => {
  const enable = getValue(ctx, key);
  const { userId, githubLogin } = ctx.session;

  await ResumePub.updatePubResume(userId, {
    openShare: enable
  });
  const findResult = await ResumePub.findOne({ userId });
  const { resumeHash, simplifyUrl, resumeHashV0 } = findResult.result;
  if (!enable) {
    await ctx.cache.hdel('share-resume-hash', resumeHash);
    await ctx.cache.hdel('share-resume-login', githubLogin);
  } else {
    simplifyUrl && await ctx.cache.hset('share-resume-login', githubLogin, JSON.stringify({
      userId,
      resumeHash,
      openShare: enable,
    }));
    await ctx.cache.hset('share-resume-hash', resumeHash, JSON.stringify({
      userId,
      openShare: enable,
      login: githubLogin,
    }));
    await ctx.cache.hset('resume-hash-map', resumeHashV0, resumeHash);
  }
  await next();
};

const checkValidateByLogin = (key = 'query.login') => async (ctx, next) => {
  const login = getValue(ctx, key);
  const { githubLogin } = ctx.session;
  const shareInfoStr = await ctx.cache.hget('share-resume-login', login);
  if (!shareInfoStr) return ctx.redirect('/404');
  const {
    openShare,
    resumeHash,
  } = JSON.parse(shareInfoStr);
  if (!openShare && login !== githubLogin) return ctx.redirect('/404');
  ctx.query.hash = resumeHash;
  await next();
};

const checkValidateByHash = (key = 'params.hash') => async (ctx, next) => {
  const resumeHash = getValue(ctx, key);
  const hash = await ctx.cache.hget('resume-hash-map', resumeHash) || resumeHash;
  const shareInfoStr = await ctx.cache.hget('share-resume-hash', hash);
  if (!shareInfoStr) return ctx.redirect('/404');
  const {
    userId,
    openShare,
  } = JSON.parse(shareInfoStr);
  const targetUserId = ctx.query.userId || ctx.session.userId;
  const enable = openShare || targetUserId === userId;
  if (!enable) return ctx.redirect('/404');
  if (ctx.query.userId === ctx.session.userId) ctx.session.fromDownload = true;
  await next();
};

export default {
  toggleHashShare,
  toggleLoginShare,
  checkValidateByHash,
  checkValidateByLogin,
};


import ShareAnalyse from '../../models/share-analyse';
import logger from '../../utils/logger';
import User from '../../models/users';
import ResumePub from '../../models/resume-pub';
import SlackMsg from '../../services/slack';

const getPubResumeInfo = async (ctx) => {
  const { hash } = ctx.params;
  const findResume = await ResumePub.getPubResumeInfo(hash);

  if (findResume.success) {
    const { name, userId, resumeHash } = findResume.result;
    const user = await User.findOne({ userId });
    return {
      name,
      resumeHash,
      login: user.githubInfo.login
    };
  }
};

const updateViewData = async (ctx, options) => {
  const { from } = ctx.query;
  const { platform, browser } = ctx.state;
  const {
    url = '',
    login = null,
    type = null
  } = options;
  const updateResult = await ShareAnalyse.updateShare({ login, url });
  if (!updateResult.success) {
    ctx.redirect('/404');
    return;
  }
  await ShareAnalyse.updateViewData({
    platform,
    url: options.url,
    browser: browser || '',
    from: from || ''
  });
  if (type) {
    ctx.cache.hincrby(type, 'pageview', 1);
    new SlackMsg(ctx.mq).send({
      type: 'view',
      data: `【${type.toUpperCase()}:/${url}】`
    });
  }
  logger.info(`[${type.toUpperCase()}:VIEW][${url}]`);
};

const collectGithubRecord = async (ctx, next) => {
  const { login } = ctx.params;
  const { githubLogin } = ctx.session;

  // make sure that admin user's visit will not be collected.
  if (githubLogin !== login) {
    const url = `github/${login}`;
    updateViewData(ctx, { login, url, type: 'github' });
  }
  await next();
};

const collectResumeRecord = async (ctx, next) => {
  const { notrace } = ctx.query;

  const { githubLogin } = ctx.session;
  const user = await getPubResumeInfo(ctx);
  const isAdmin = user && user.login === githubLogin;

  if ((!isAdmin && !notrace) || notrace === 'false') {
    const url = `resume/${user.resumeHash}`;
    updateViewData(ctx, { url, type: 'resume' });
  }

  ctx.query.isAdmin = isAdmin;
  ctx.query.userName = user ? user.name : '';
  ctx.query.userLogin = user ? user.login : '';
  await next();
};

export default {
  github: collectGithubRecord,
  resume: collectResumeRecord
};

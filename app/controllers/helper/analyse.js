import config from 'config';
import ShareAnalyse from '../../models/share-analyse';
import Slack from '../../services/slack';
import logger from '../../utils/logger';
import User from '../../models/users';
import ResumePub from '../../models/resume-pub';

const URL = config.get('url');

const getPubResumeInfo = async (ctx) => {
  const { hash } = ctx.params;
  const findResume = await ResumePub.getPubResumeInfo({ resumeHash: hash });

  const { name, userId } = findResume.result;
  const user = await User.findUserById(userId);
  return {
    name,
    login: user.githubInfo.login
  };
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
    Slack.msg({
      type: 'view',
      data: `[${type.toUpperCase()}:VIEW][/${url}]`
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
  const { hash } = ctx.params;

  const { githubLogin } = ctx.session;
  const user = await getPubResumeInfo(ctx);
  const isAdmin = user.login === githubLogin;

  if (!isAdmin && !notrace || notrace === 'false') {
    const url = `resume/${hash}`;
    updateViewData(ctx, { url, type: 'resume' });
  }

  ctx.query.isAdmin = isAdmin;
  ctx.query.userName = user.name;
  ctx.query.userLogin = user.login;
  await next();
};

export default {
  github: collectGithubRecord,
  resume: collectResumeRecord
};

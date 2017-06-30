import config from 'config';
import ShareAnalyse from '../../models/share-analyse';
import Slack from '../../services/slack';
import logger from '../../utils/logger';

const URL = config.get('url');

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
  }
  logger.info(`[${type.toUpperCase()}:VIEW][${url}]`);
};

const collectGithubRecord = async (ctx, next) => {
  const { login } = ctx.params;
  const { githubLogin } = ctx.session;

  // make sure that admin user's visit will not be collected.
  if (githubLogin && githubLogin === login) {
    await next();
    return;
  }
  const url = `github/${login}`;
  Slack.msg({
    type: 'view',
    data: `GitHub view of /${url}`
  });
  updateViewData(ctx, { login, url, type: 'github' });
  await next();
};

const collectResumeRecord = async (ctx, next) => {
  const { notrace } = ctx.query;
  const { hash } = ctx.params;

  if (!notrace || notrace === 'false') {
    const url = `resume/${hash}`;
    updateViewData(ctx, { url, type: 'resume' });
    Slack.msg({
      type: 'view',
      data: `Resume view of /${url}`
    });
  }

  await next();
};

export default {
  github: collectGithubRecord,
  resume: collectResumeRecord
};

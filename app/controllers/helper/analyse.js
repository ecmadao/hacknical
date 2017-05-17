import config from 'config';
import ShareAnalyse from '../../models/share-analyse';
import Slack from '../../services/slack';

const URL = config.get('url');

const updateViewData = async (ctx, options) => {
  const { from } = ctx.query;
  const { platform, browser } = ctx.state;
  const updateResult = await ShareAnalyse.updateShare(options);
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
  updateViewData(ctx, { login, url });
  await next();
};

const collectResumeRecord = async (ctx, next) => {
  const { notrace } = ctx.query;
  const { hash } = ctx.params;

  if (!notrace || notrace === 'false') {
    const url = `resume/${hash}`;
    updateViewData(ctx, { url });
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

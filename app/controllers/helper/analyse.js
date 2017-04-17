import ShareAnalyse from '../../models/share-analyse';

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
  updateViewData(ctx, { login, url });
  await next();
};

const collectResumeRecord = async (ctx, next) => {
  const { notrace } = ctx.query;
  const { hash } = ctx.params;

  if (!notrace || notrace === 'false') {
    const url = `resume/${hash}`;
    updateViewData(ctx, { url });
  }

  await next();
};

export default {
  github: collectGithubRecord,
  resume: collectResumeRecord
};

import ShareAnalyse from '../../models/share-analyse';

const collect = async (ctx, next) => {
  const { from } = ctx.query;
  const { login } = ctx.params;
  const { githubLogin } = ctx.session;

  // make sure that admin user's visit will not be collected.
  if (githubLogin && githubLogin === login) {
    await next();
    return;
  }

  const { platform, browser } = ctx.state;
  const url = `github/${login}`;
  const updateResult = await ShareAnalyse.updateShare({ login, url });
  if (!updateResult.success) {
    ctx.redirect('/404');
    return;
  }
  await ShareAnalyse.updateViewData({
    url,
    platform,
    browser: browser || '',
    from: from || ''
  });
  await next();
};

const collectResumeData = async (ctx, next) => {
  const { from, notrace } = ctx.query;
  const { hash } = ctx.params;

  if (!notrace || notrace === 'false') {
    const { platform, browser } = ctx.state;
    const url = `resume/${hash}`;
    const updateResult = await ShareAnalyse.updateShare({ url });
    if (!updateResult.success) {
      ctx.redirect('/404');
      return;
    }
    await ShareAnalyse.updateViewData({
      url,
      platform,
      browser: browser || '',
      from: from || ''
    });
  }

  await next();
};

export default {
  collect,
  collectResumeData
}

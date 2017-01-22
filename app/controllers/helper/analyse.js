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
  const updateResult = await ShareAnalyse.updateShare(login, url);
  if (!updateResult.success) {
    ctx.redirect('/404');
    return;
  }
  await ShareAnalyse.updateViewData({
    url,
    login,
    platform,
    browser: browser || '',
    from: from || ''
  });
  await next();
};

export default {
  collect
}

import ShareAnalyse from '../../models/share-analyse';

const collect = async (ctx, next) => {
  const { from } = ctx.query;
  const { login } = ctx.params;
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

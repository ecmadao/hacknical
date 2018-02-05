import ShareAnalyse from '../../models/share-analyse';
import { getValue } from '../../utils/helper';

const githubEnable = (key = 'params.login') => async (ctx, next) => {
  const login = getValue(ctx, key);
  const { githubLogin } = ctx.session;
  if (login !== githubLogin) {
    const shareAnalyse = await ShareAnalyse.findOne({
      login,
      url: `github/${login}`
    });
    if (!shareAnalyse || !shareAnalyse.enable) {
      return ctx.redirect('/404');
    }
  }
  await next();
};

export default {
  githubEnable,
};

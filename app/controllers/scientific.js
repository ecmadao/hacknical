
import GitHubAPI from '../services/github';
import notify from '../services/notify';
import getCacheKey from './helper/cacheKey';
import StatAPI from '../services/stat';

const getUserStatistic = async (ctx) => {
  const { login } = ctx.params;
  const { githubToken } = ctx.session;
  const result = await GitHubAPI.getUserStatistic(login, githubToken);
  ctx.body = {
    result,
    success: true,
  };
};

const getUserPredictions = async (ctx) => {
  const { login } = ctx.params;
  const { githubToken, githubLogin } = ctx.session;
  const result = login === githubLogin
    ? (await GitHubAPI.getUserPredictions(githubLogin, githubToken) || [])
    : [];
  const results = [];
  await Promise.all(result.map(async (repository) => {
    const { full_name } = repository;

    const stats = await StatAPI.getStat({
      type: 'scientific-feedback',
      action: `${full_name}.liked`
    });
    const stat = stats[0] || { count: 0 };

    const likedCount = stat.count;
    repository.likedCount = likedCount || 0;
    results.push(repository);
  }));
  ctx.body = {
    success: true,
    result: results,
  };
};

const removePrediction = async (ctx, next) => {
  const { login } = ctx.params;
  const { githubLogin } = ctx.session;
  const { fullName } = ctx.request.body;
  if (login === githubLogin) {
    await GitHubAPI.removePrediction(login, fullName);
  }

  notify.slack({
    mq: ctx.mq,
    data: {
      type: 'scientific',
      data: `Prediction removed by <https://github.com/${githubLogin}|${githubLogin}>: <https://github.com/${fullName}|${fullName}>`
    }
  });

  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey('user-predictions', {
      params: ['login']
    })
  ];

  await StatAPI.putStat({
    type: 'scientific-prediction',
    action: `${login}.remove`
  });
  ctx.body = {
    success: true,
  };
  await next();
};

const putPredictionFeedback = async (ctx, next) => {
  const { login } = ctx.params;
  const { githubLogin } = ctx.session;
  const { fullName, liked } = ctx.request.body;
  if (login === githubLogin) {
    await GitHubAPI.putPredictionsFeedback(login, fullName, liked);
  }

  const likeText = Number(liked) > 0 ? 'liked' : 'disliked';
  notify.slack({
    mq: ctx.mq,
    data: {
      type: 'scientific',
      data: `Prediction ${likeText} by <https://github.com/${githubLogin}|${githubLogin}>: <https://github.com/${fullName}|${fullName}>`
    }
  });

  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey('user-predictions', {
      params: ['login']
    })
  ];

  await Promise.all([
    StatAPI.putStat({
      type: 'scientific-prediction',
      action: `${login}.${likeText}`
    }),
    StatAPI.putStat({
      type: 'scientific-feedback',
      action: `${fullName}.${likeText}`
    })
  ]);

  ctx.body = {
    success: true,
  };
  await next();
};

export default {
  removePrediction,
  getUserStatistic,
  getUserPredictions,
  putPredictionFeedback,
};

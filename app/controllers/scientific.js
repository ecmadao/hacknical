import Api from '../services/api';
import SlackMsg from '../services/slack';
import getCacheKey from './helper/cacheKey';

const getUserStatistic = async (ctx) => {
  const { login } = ctx.params;
  const { githubToken } = ctx.session;
  const result = await Api.getUserStatistic(login, githubToken);
  ctx.body = {
    result,
    success: true,
  };
};

const getUserPredictions = async (ctx) => {
  const { login } = ctx.params;
  const { githubToken, githubLogin } = ctx.session;
  const result = login === githubLogin
    ? (await Api.getUserPredictions(githubLogin, githubToken) || [])
    : [];
  const results = [];
  await Promise.all(result.map(async (repository) => {
    const { full_name } = repository;
    const likedCount = await ctx.cache.hget('scientific-feedback', `${full_name}.liked`);
    repository.likedCount = likedCount || 0;
    results.push(repository);
  }));
  ctx.body = {
    result: results,
    success: true,
  };
};

const removePrediction = async (ctx, next) => {
  const { login } = ctx.params;
  const { githubLogin } = ctx.session;
  const { fullName } = ctx.request.body;
  if (login === githubLogin) {
    await Api.removePrediction(login, fullName);
  }

  new SlackMsg(ctx.mq).send({
    type: 'scientific',
    data: `Prediction removed by <https://github.com/${githubLogin}|${githubLogin}>: <https://github.com/${fullName}|${fullName}>`
  });

  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey('user-predictions', {
      params: ['login']
    })
  ];
  ctx.cache.hincrby('scientific-prediction', `${login}.remove`, 1);
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
    await Api.putPredictionsFeedback(login, fullName, liked);
  }

  const likeText = Number(liked) > 0 ? 'liked' : 'disliked';
  new SlackMsg(ctx.mq).send({
    type: 'scientific',
    data: `Prediction ${likeText} by <https://github.com/${githubLogin}|${githubLogin}>: <https://github.com/${fullName}|${fullName}>`
  });

  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey('user-predictions', {
      params: ['login']
    })
  ];
  ctx.cache.hincrby('scientific-prediction', `${login}.${likeText}`, 1);
  ctx.cache.hincrby('scientific-feedback', `${fullName}.${likeText}`, 1);
  ctx.body = {
    success: true,
  };
  await next();
};

export default {
  getUserStatistic,
  getUserPredictions,
  removePrediction,
  putPredictionFeedback,
};

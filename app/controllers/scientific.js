import Api from '../services/api';
import SlackMsg from '../services/slack';

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
    ? await Api.getUserPredictions(githubLogin, githubToken)
    : [];
  ctx.body = {
    result: result || [],
    success: true,
  };
};

const removePrediction = async (ctx) => {
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

  ctx.body = {
    success: true,
  }
};

const putPredictionFeedback = async (ctx) => {
  const { login } = ctx.params;
  const { githubLogin } = ctx.session;
  const { fullName, liked } = ctx.request.body;
  if (login === githubLogin) {
    await Api.putPredictionsFeedback(login, fullName, liked);
  }

  new SlackMsg(ctx.mq).send({
    type: 'scientific',
    data: `Prediction ${Number(liked) > 0 ? 'liked' : 'disliked'} by <https://github.com/${githubLogin}|${githubLogin}>: <https://github.com/${fullName}|${fullName}>`
  });

  ctx.body = {
    success: true,
  }
};

export default {
  getUserStatistic,
  getUserPredictions,
  removePrediction,
  putPredictionFeedback,
};

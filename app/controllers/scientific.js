import Api from '../services/api';

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
    result,
    success: true,
  };
};

const putPredictionFeedback = async (ctx) => {
  const { login } = ctx.params;
  const { githubLogin } = ctx.session;
  const { fullName, liked } = ctx.request.body;
  if (login === githubLogin) {
    await Api.putPredictionsFeedback(login, fullName, liked);
  }

  ctx.body = {
    success: true,
  }
};

export default {
  getUserStatistic,
  getUserPredictions,
  putPredictionFeedback,
};

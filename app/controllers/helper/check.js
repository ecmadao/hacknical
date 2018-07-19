
const checkQuery = (...params) => async (ctx, next) => {
  for (const param of params) {
    if (!{}.hasOwnProperty.call(ctx.query, param)) {
      throw new Error(`required parameters '${param}' is missed.`);
    }
  }
  await next();
};

const checkBody = (...params) => async (ctx, next) => {
  for (const param of params) {
    if (!{}.hasOwnProperty.call(ctx.request.body, param)) {
      throw new Error(`required body '${param}' is missed.`);
    }
  }
  await next();
};

const checkSession = (params = []) => async (ctx, next) => {
  const result = params.every(key => ctx.session[key]);
  if (!result) {
    ctx.body = {
      url: '/',
      success: true,
      message: ctx.__('messages.error.logout'),
    };
    return;
  }
  await next();
};

export default {
  query: checkQuery,
  body: checkBody,
  session: checkSession,
};

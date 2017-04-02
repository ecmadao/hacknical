
const checkQuery = (...params) => {
  return async (ctx, next) => {
    params.forEach((param) => {
      if (!{}.hasOwnProperty.call(ctx.query, param)) {
        throw new Error(`required parameters '${param}' is missed.`);
      }
    });
    await next();
  };
};

const checkBody = (...params) => {
  return async (ctx, next) => {
    params.forEach((param) => {
      if (!{}.hasOwnProperty.call(ctx.request.body, param)) {
        throw new Error(`required body '${param}' is missed.`);
      }
    });
    await next();
  };
};

export default {
  query: checkQuery,
  body: checkBody
};

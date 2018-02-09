import looger from '../../utils/logger';

const checkQuery = (...params) => async (ctx, next) => {
  params.forEach((param) => {
    if (!{}.hasOwnProperty.call(ctx.query, param)) {
      looger.error(`required parameters '${param}' is missed.`);
      return ctx.body = {
        success: false,
        error: `required parameters '${param}' is missed.`
      };
    }
  });
  await next();
};

const checkBody = (...params) => async (ctx, next) => {
  params.forEach((param) => {
    if (!{}.hasOwnProperty.call(ctx.request.body, param)) {
      looger.error(`required body '${param}' is missed.`);
      return ctx.body = {
        success: false,
        error: `required body '${param}' is missed.`
      };
    }
  });
  await next();
};

export default {
  query: checkQuery,
  body: checkBody
};

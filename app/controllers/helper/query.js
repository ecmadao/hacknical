
const checkQuery = (...params) => {
  return async (ctx, next) => {
    params.forEach((param) => {
      if (!{}.hasOwnProperty.call(ctx.query, param)) {
        throw new Error(`required parameters '${param}' is missed.`);
      }
    });
    await next();
  };
}

export default {
  check: checkQuery
};

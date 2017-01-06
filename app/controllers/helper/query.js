
const checkQuery = (params) => {
  return async (ctx, next) => {
    Object.keys(params).forEach((key) => {
      if (params[key] === 'required') {
        if (!{}.hasOwnProperty.call(ctx.query, key)) {
          throw new Error(`required parameters '${key}' is missed.`);
        }
      }
    });
    await next();
  };
}

export default {
  check: checkQuery
};

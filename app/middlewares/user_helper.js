const checkIfLogin = (redirect = '/user/login') =>  async (ctx, next) => {
  const userId = ctx.session.userId;
  if (!userId) {
    return ctx.redirect(redirect);
  }
  await next();
};

const checkIfNotLogin = (redirect = '/dashboard') => async (ctx, next) => {
  const userId = ctx.session.userId;
  if (userId) {
    return ctx.redirect(redirect);
  }
  await next();
};

const checkIsEmail = email => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

export default {
  checkIsEmail,
  checkIfLogin,
  checkIfNotLogin,
};

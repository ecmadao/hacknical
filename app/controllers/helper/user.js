const checkSession = (params = []) => async (ctx, next) => {
  const check = params.some(key => !ctx.session[key]);
  if (check) {
    ctx.body = {
      success: true,
      message: 'session 缺失，请登录'
    };
    return;
  }
  await next();
};

const checkIfLogin = (redirect = '/user/login')  => async (ctx, next)=> {
  const userId = ctx.session.userId;
  if (!userId) {
    return ctx.redirect(redirect);
  }
  await next();
};

const checkIfNotLogin = (redirect = '/user/dashboard') => async (ctx, next) => {
  const userId = ctx.session.userId;
  if (userId) {
    return ctx.redirect(redirect);
  }
  await next();
};

const checkIsEmail = (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

export default {
  checkSession,
  checkIfLogin,
  checkIfNotLogin
}

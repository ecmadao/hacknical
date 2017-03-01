import session from './session';

const check = (params, sessions) => params.some(key => sessions[key]);

const checkSession = (params = []) => async (ctx, next) => {
  if (!check(params, ctx.session)) {
    return ctx.body = {
      success: true,
      message: 'session 缺失，请登录',
      url: '/user/login'
    };
  }
  await next();
};

const checkIfLogin = (redirect = '/user/login')  => async (ctx, next)=> {
  const checkResult = check(session.requiredSessions, ctx.session);
  if (!checkResult) {
    return ctx.redirect(redirect);
  }
  await next();
};

const checkIfNotLogin = (redirect = '/user/dashboard') => async (ctx, next) => {
  const checkResult = check(session.requiredSessions, ctx.session);
  if (checkResult) {
    return ctx.redirect(redirect);
  }
  await next();
}

const checkIsEmail = (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

export default {
  checkSession,
  checkIfLogin,
  checkIfNotLogin,
  checkIsEmail
}

import session from './session';
import User from '../../models/users';

const check = (params, sessions) => params.some(key => sessions[key]);

const checkSession = (params = []) => async (ctx, next) => {
  if (!check(params, ctx.session)) {
    ctx.body = {
      success: true,
      message: 'session 缺失，请登录',
      url: '/'
    };
    return;
  }
  await next();
};

const checkNotLogin = () => async (ctx, next) => {
  const checkResult = check(session.requiredSessions, ctx.session);
  if (checkResult) {
    const { githubLogin } = ctx.session;
    return ctx.redirect(`/${githubLogin}`);
  }
  await next();
};

const checkIfLogin = (redirect = '/')  => async (ctx, next) => {
  const checkResult = check(session.requiredSessions, ctx.session);
  if (!checkResult) {
    return ctx.redirect(redirect);
  }
  await next();
};

const checkIsEmail = email =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

const checkValidateUser = () => async (ctx, next) => {
  const { login } = ctx.params;
  const isValidate = await User.findUserByLogin(login);
  if (!isValidate) {
    ctx.session.userId = null;
    ctx.session.githubToken = null;
    ctx.session.githubLogin = null;
    return ctx.redirect('/404');
  }
  const { githubLogin } = ctx.session;
  if (login !== githubLogin) {
    return ctx.redirect(`/${githubLogin}`);
  }
  await next();
};

export default {
  checkSession,
  checkIfLogin,
  checkNotLogin,
  checkIsEmail,
  checkValidateUser
};

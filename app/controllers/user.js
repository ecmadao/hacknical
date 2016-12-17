import User from '../models/users/index';
import Resume from '../models/resumes/index';

// user login/logout/signup

const login = async (ctx, next) => {
  const { email, pwd } = ctx.request.body;
  const loginResult = await User.login(email, pwd);
  const { message, success, result } = loginResult;
  if (success) {
    ctx.session.userId = result;
  }
  ctx.body = {
    message,
    success
  };
};

const logout = async (ctx, next) => {
  ctx.session.userId = null;
  ctx.redirect('/');
};

const signup = async (ctx, next) => {
  const { email, pwd } = ctx.request.body;
  const signupResult = await User.createUser(email, pwd);
  const { message, success, result } = loginResult;
  if (success) {
    const { _id, userName, email } = result;
    ctx.session.userId = _id;
    await Resume.initialResume(_id, {
      email,
      name: userName
    });
  }
  ctx.body = {
    message,
    success
  };
};

const loginPage = async (ctx, next) => {
  await ctx.render('user/login', {
    title: '登录'
  });
};

// user dashboard

const dashboard = async (ctx, next) => {
  await ctx.render('user/dashboard', {
    title: 'dashboard'
  });
};

const getResume = async (ctx, next) => {
  const userId = ctx.session.userId;
  const getResult = await Resume.getResume(userId);
  const { message, success, result } = getResult;
  ctx.body = {
    message,
    success,
    result
  };
};

const setResume = async (ctx, next) => {
  const { resume } = ctx.request.body;
  const userId = ctx.session.userId;
  const setResult = await Resume.updateResume(userId, resume);
  const { message, success, result } = setResult;
  ctx.body = {
    message,
    success,
    result
  };
};

export default {
  // user
  login,
  logout,
  signup,
  loginPage,
  // dashboard
  dashboard,
  getResume,
  setResume
}

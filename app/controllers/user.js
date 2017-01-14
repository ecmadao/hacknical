import User from '../models/users';
import Resume from '../models/resumes';
import ShareAnalyse from '../models/share-analyse';
import Github from '../services/github';

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
  ctx.session.githubToken = null;
  ctx.session.githubLogin = null;
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
    title: '登录 - 查看 github 年度总结'
  });
};

const githubLogin = async (ctx, next) => {
  const { code } = ctx.request.query;
  const result = await Github.getToken(code);
  try {
    const githubToken = result.match(/^access_token=(\w+)&/)[1];
    console.log('===== user githubToken is =====');
    console.log(githubToken);
    const userInfo = await Github.getUser(githubToken);
    if (userInfo) {
      ctx.session.githubToken = githubToken;
      const githubUser = JSON.parse(userInfo);
      ctx.session.githubLogin = githubUser.login;
      const loginResult = await User.loginWithGithub(githubUser);
      if (loginResult) {
        ctx.session.userId = loginResult.result._id;
        return ctx.redirect('/user/dashboard');
      }
    }
    return ctx.redirect('/user/login');
  } catch (TypeError) {
    return ctx.redirect('/user/login');
  }
};

// user dashboard

const dashboard = async (ctx, next) => {
  if (ctx.state.isMobile) {
    const userId = ctx.session.userId;
    const findResult = await User.findUserById(userId);
    const login = findResult.githubInfo.login;
    ctx.redirect(`/github/${login}`);
  }

  // ctx.state.isMobile
  await ctx.render('user/dashboard', {
    title: '用户主页'
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
  const { resume } = ctx.query;
  const resumeObj = JSON.parse(resume);
  const userId = ctx.session.userId;

  const setResult = await Resume.updateResume(userId, resumeObj);
  const { success, result } = setResult;
  ctx.body = {
    message: '储存成功',
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
  githubLogin,
  // dashboard
  dashboard,
  getResume,
  setResume
}

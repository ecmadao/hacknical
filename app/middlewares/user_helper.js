// const checkIfUserLogin = async (ctx, next) => {
//   const userId = ctx.session.userId;
//   const user = ctx.session.user;
//   if (user) {
//     ctx.body = {
//       success: true,
//       message: '已登录',
//       data: user
//     }
//     return;
//   }
//   await next();
// };

const checkIfLogin = (redirect = '/user/login') => {
  return async (ctx, next) => {
    const userId = ctx.session.userId;
    if (!userId) {
      return ctx.redirect(redirect);
    }
    await next();
  }
};

const checkIfNotLogin = (redirect = '/user/dashboard') => {
  return async (ctx, next) => {
    const userId = ctx.session.userId;
    if (userId) {
      return ctx.redirect(redirect);
    }
    await next();
  }
};

const checkIsEmail = (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

export default {
  checkIfLogin,
  checkIfNotLogin
}

const login = async (ctx, next) => {
  await ctx.render('user/login', {
    title: '登录'
  });
};

const dashboard = async (ctx, next) => {
  await ctx.render('user/dashboard', {
    title: 'dashboard'
  });
};

export default {
  login,
  dashboard
}

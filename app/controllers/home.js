const index = async (ctx, next) => {
  ctx.redirect('/user/dashboard');
};

export default {
  index
}

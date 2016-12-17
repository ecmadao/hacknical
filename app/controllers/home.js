import User from '../models/users/index';

const index = async (ctx, next) => {
  const findUser = await User.findUser('wlec@outlook.com');
  if (findUser) {
    ctx.session.userId = findUser._id;
  }
  ctx.redirect('/user/dashboard');
};

export default {
  index
}

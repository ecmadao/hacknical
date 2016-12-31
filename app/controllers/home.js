import User from '../models/users/index';

const index = async (ctx, next) => {
  ctx.redirect('/user/dashboard');
};

export default {
  index
}

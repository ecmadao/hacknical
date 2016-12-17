import User from '../../app/models/users/index';

const initUser = async () => {
  try {
    const result = await User.createUser('wlec@outlook.com', '12345678');
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

export default initUser;

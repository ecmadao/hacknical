import crypto from 'crypto';
import User from './schema';

/**
 * private
 */
const getHashPwd = (salt, password) => {
  const bytes = new Buffer(password || '', 'utf16le');
  const src = new Buffer(salt || '', 'base64');
  const dst = new Buffer(src.length + bytes.length);

  src.copy(dst, 0, 0, src.length);
  bytes.copy(dst, src.length, 0, bytes.length);

  return crypto.createHash('sha1').update(dst).digest('base64');
};

const createUser = async (email, pwd) => {
  const findUser = await User.findOne({ email });
  if (findUser) {
    return Promise.resolve({
      success: false,
      message: '该邮箱已存在'
    });
  }

  const passwordSalt = crypto.randomBytes(16).toString('base64');
  const passwordHash = getHashPwd(passwordSalt, pwd);

  const newUser = await User.create({
    userName: '',
    lastLoginTime: new Date(),
    email,
    passwordSalt,
    passwordHash
  });

  return Promise.resolve({
    success: true,
    message: '注册成功',
    result: newUser
  });

  // return new Promise((resolve, reject) => {
  //   User.create({
  //     userName: '',
  //     lastLoginTime: new Date(),
  //     email,
  //     passwordSalt,
  //     passwordHash
  //   });
  // });
};

const login = async (email, pwd) => {
  const findUser = await User.findOne({ email });
  if (!findUser) {
    return Promise.resolve({
      success: false,
      message: '该邮箱尚未注册'
    });
  }

  const { passwordSalt } = findUser;
  const passwordHash = getHashPwd(passwordSalt, pwd);
  if (passwordHash !== findUser.passwordHash) {
    return Promise.resolve({
      success: false,
      message: '密码错误'
    });
  }

  findUser.lastLoginTime = new Date();
  await findUser.save();

  const userId = findUser._id;
  return Promise.resolve({
    success: true,
    message: '登录成功',
    result: userId
  });
};

const changePwd = () => {

};

export default {
  createUser,
  login,
  changePwd
}

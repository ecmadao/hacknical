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

const findUser = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (email, pwd) => {
  const findResult = await findUser(email);
  if (findResult) {
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
};

const loginWithGithub = async (userInfo) => {
  const {
    id,
    login,
    name,
    avatar_url,
    company,
    blog,
    location,
    email,
    bio,
    created_at,
    updated_at
  } = userInfo;
  const newUser = await User.create({
    email,
    userName: name,
    lastLoginTime: new Date(),
    githubId: id,
    githubInfo: {
      login,
      avatar_url,
      company,
      blog,
      location,
      email,
      bio,
      created_at,
      updated_at
    }
  });
  if (newUser) {
    return Promise.resolve({
      success: true,
      result: newUser
    });
  }
  return Promise.resolve({
    success: false,
    result: null
  });
};

const login = async (email, pwd) => {
  const findResult = await findUser(email);
  if (!findResult) {
    return Promise.resolve({
      success: false,
      message: '该邮箱尚未注册'
    });
  }

  const { passwordSalt } = findResult;
  const passwordHash = getHashPwd(passwordSalt, pwd);
  if (passwordHash !== findResult.passwordHash) {
    return Promise.resolve({
      success: false,
      message: '密码错误'
    });
  }

  findResult.lastLoginTime = new Date();
  await findResult.save();

  const userId = findResult._id;
  return Promise.resolve({
    success: true,
    message: '登录成功',
    result: userId
  });
};

const changePwd = () => {

};

const remove = async (userId) => {
  const removeUser = await User.remove({ _id: userId });
  return Promise.resolve({
    success: true,
    message: '删除成功',
    result: removeUser
  });
};

const removeAll = async () => {
  await User.remove();
};

export default {
  findUser,
  createUser,
  login,
  changePwd,
  removeAll,
  loginWithGithub
}

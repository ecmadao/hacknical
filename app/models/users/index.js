import User from './schema';
import ShareAnalyse from '../share-analyse';

/**
 * private
 */
const getGithubInfo = (userInfo) => {
  const {
    id,
    login,
    name,
    email,
  } = userInfo;
  return {
    id,
    login,
    name,
    email
  }
};

const findUser = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (userId) => {
  return await User.findOne({ _id: userId });
};

const findUserByLogin = async (login) => {
  return await User.findOne({ 'githubInfo.login': login });
};


const findUserByGithubId = async (githubId) => {
  return await User.findOne({ githubId });
};

const createGithubShare = async (options) => {
  await ShareAnalyse.createShare(options);
};

const updateUserInfo = async (options = {}) => {
  const user = await findUserById(options.userId);
  delete options.userId;
  Object.keys(options).forEach((key) => {
    user[key] = options[key];
  });
  await user.save();
  return Promise.resolve({
    success: true
  });
};

const updateUser = async (userInfo) => {
  const newGithubInfo = getGithubInfo(userInfo);
  const lastUpdateTime = new Date();
  newGithubInfo.lastUpdateTime = lastUpdateTime;
  const findUser = await findUserByGithubId(userInfo.id);
  findUser.githubInfo = newGithubInfo;
  await findUser.save();
  return Promise.resolve({
    success: true,
    result: lastUpdateTime
  });
};

const updateUserOrgs = async (login, orgs = []) => {
  const user = await findUserByLogin(login);
  if (!user) {
    return Promise.resolve({
      success: false
    });
  }
  user.orgs = [...orgs];
  await user.save();
  return Promise.resolve({
    success: true,
    result: user
  });
};

const loginWithGithub = async (userInfo) => {
  const {
    id,
    login,
    name,
    email
  } = userInfo;
  const shareInfo = {
    login,
    url: `github/${login}`
  };
  const findUser = await findUserByGithubId(id);
  if (findUser) {
    shareInfo.userId = findUser._id;
    await createGithubShare(shareInfo);
    findUser.githubLogin = login;
    findUser.githubInfo = { login };
    findUser.lastLoginTime = new Date();
    await findUser.save();
    return Promise.resolve({
      success: true,
      result: findUser._id
    });
  }
  const newUser = await User.create({
    email,
    userName: name,
    lastLoginTime: new Date(),
    githubId: id,
    githubLogin: login,
    githubInfo: { login }
  });
  shareInfo.userId = newUser._id;
  await createGithubShare(shareInfo);
  return Promise.resolve({
    success: true,
    result: newUser._id
  });
};

const findPinnedRepos = async (login) => {
  try {
    const user = await findUserByLogin(login);
    return Promise.resolve(user.pinnedRepos);
  } catch (err) {
    return Promise.resolve({});
  }
};

const updatePinnedRepos = async (login, repos) => {
  try {
    const user = await findUserByLogin(login);
    user.pinnedRepos = [...repos];
    await user.save();
    return Promise.resolve({
      success: true
    });
  } catch (err) {
    return Promise.resolve({
      success: false
    });
  }
};

const findGithubSections = async (login) => {
  try {
    const user = await findUserByLogin(login);
    return Promise.resolve(user.githubSections);
  } catch (err) {
    return Promise.resolve({});
  }
};

const updateGithubSections = async (login, sections) => {
  try {
    const user = await findUserByLogin(login);
    Object.assign(user.githubSections, sections);
    await user.save();
    return Promise.resolve({
      success: true
    });
  } catch (err) {
    return Promise.resolve({
      success: false
    });
  }
};

export default {
  findUser,
  loginWithGithub,
  findUserByGithubId,
  findUserById,
  findUserByLogin,
  updateUser,
  updateUserInfo,
  updateUserOrgs,
  findGithubSections,
  updateGithubSections,
  findPinnedRepos,
  updatePinnedRepos
}


/*

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

const changePwd = async () => {

};

const remove = async (userId) => {
  const removeUser = await User.remove({ _id: userId });
  return Promise.resolve({
    success: true,
    message: '删除成功',
    result: removeUser
  });
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

const getHashPwd = (salt, password) => {
  const bytes = new Buffer(password || '', 'utf16le');
  const src = new Buffer(salt || '', 'base64');
  const dst = new Buffer(src.length + bytes.length);

  src.copy(dst, 0, 0, src.length);
  bytes.copy(dst, src.length, 0, bytes.length);

  return crypto.createHash('sha1').update(dst).digest('base64');
};

 */

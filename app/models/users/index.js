import User from './schema';
import ShareAnalyse from '../share-analyse';
import Slack from '../../services/slack';

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
  let user = await findUserByGithubId(id);
  const msg = { type: 'login' };
  if (user) {
    shareInfo.userId = user._id;
    await createGithubShare(shareInfo);
    user.githubLogin = login;
    user.githubInfo = { login };
    user.lastLoginTime = new Date();
    await user.save();

    msg.data = `<https://github.com/${login}|${login}> logined!`;
  } else {
    user = await User.create({
      email,
      userName: name,
      lastLoginTime: new Date(),
      githubId: id,
      githubLogin: login,
      githubInfo: { login }
    });
    shareInfo.userId = user._id;
    await createGithubShare(shareInfo);

    msg.type = 'signup';
    msg.data = `Signup: <https://github.com/${login}|${login}>`;
  }

  Slack.msg(msg);

  return Promise.resolve({
    success: true,
    result: user._id
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
};

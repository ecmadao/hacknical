import shortid from 'shortid';
import User from './schema';
import ShareAnalyse from '../share-analyse';
import logger from '../../utils/logger';
import notify from '../../services/notify';

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
    email,
  };
};

const findUser = async options =>
  await User.findOne(options);

const findUserByLogin = async login =>
  await findUser({ 'githubInfo.login': login });

const createGithubShare = async (options) => {
  await ShareAnalyse.createShare(options);
};

const updateUserInfo = async (options = {}) => {
  const user = await findUser({ userId: options.userId });
  Object.keys(options).forEach((key) => {
    user[key] = options[key];
  });
  await user.save();
  return {
    success: true
  };
};

const updateUser = async (userInfo) => {
  const newGithubInfo = getGithubInfo(userInfo);
  const lastUpdateTime = new Date();
  newGithubInfo.lastUpdateTime = lastUpdateTime;
  const findUserResult = await findUserByLogin(userInfo.login);
  findUserResult.githubInfo = newGithubInfo;
  await findUserResult.save();
  return {
    success: true,
    result: lastUpdateTime
  };
};

const loginWithGithub = async (userInfo, cache, mq) => {
  const {
    id,
    login,
    name,
    email
  } = userInfo;
  const shareInfo = {
    login,
    url: `${login}/github`
  };
  let user = await findUserByLogin(login);
  const msg = { type: 'login' };
  if (user) {
    user.githubLogin = login;
    user.githubInfo = { login };
    user.lastLoginTime = new Date();
    await user.save();

    msg.data = `<https://github.com/${login}|${login}> logined!`;
  } else {
    user = await User.create({
      email,
      userId: shortid.generate(),
      userName: name,
      lastLoginTime: new Date(),
      githubLogin: login,
      githubInfo: {
        id,
        login
      }
    });

    msg.type = 'signup';
    msg.data = `Signup: <https://github.com/${login}|${login}>`;
    cache.incr('users');
  }

  if (email) {
    const checkSend = await cache.hget('email-welcome', email);
    if (!checkSend) {
      notify('email').send({
        mq,
        data: {
          to: email,
          template: 'welcome'
        }
      });
      cache.hincrby('email-welcome', email, 1);
    }
  }
  shareInfo.userId = user.userId;
  createGithubShare(shareInfo);

  notify('slack').send({
    mq,
    data: msg
  });
  return {
    success: true,
    result: user
  };
};

const findPinnedRepos = async (login) => {
  try {
    const user = await findUserByLogin(login);
    return user.pinnedRepos;
  } catch (err) {
    logger.error(err);
    return {};
  }
};

const updatePinnedRepos = async (login, repos) => {
  try {
    const user = await findUserByLogin(login);
    user.pinnedRepos = [...repos];
    await user.save();
    return { success: true };
  } catch (err) {
    logger.error(err);
    return { success: false };
  }
};

const findGithubSections = async (login) => {
  try {
    const user = await findUserByLogin(login);
    return user.githubSections;
  } catch (err) {
    logger.error(err);
    return {};
  }
};

const updateGithubSections = async (login, sections) => {
  try {
    const user = await findUserByLogin(login);
    Object.assign(user.githubSections, sections);
    await user.save();
    return { success: true };
  } catch (err) {
    logger.error(err);
    return { success: false };
  }
};

const findAll = async () => await User.find({});

export default {
  loginWithGithub,
  findUserByLogin,
  updateUser,
  updateUserInfo,
  findGithubSections,
  updateGithubSections,
  findPinnedRepos,
  updatePinnedRepos,
  findAll,
  findOne: findUser,
};

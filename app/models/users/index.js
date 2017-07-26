import uuid from 'uuid/v4';
import User from './schema';
import ShareAnalyse from '../share-analyse';
import logger from '../../utils/logger';
import SlackMsg from '../../services/slack';
import EmailMsg from '../../services/email';

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
  return Promise.resolve({
    success: true
  });
};

const updateUser = async (userInfo) => {
  const newGithubInfo = getGithubInfo(userInfo);
  const lastUpdateTime = new Date();
  newGithubInfo.lastUpdateTime = lastUpdateTime;
  const findUserResult = await findUserByLogin(userInfo.login);
  findUserResult.githubInfo = newGithubInfo;
  await findUserResult.save();
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

const loginWithGithub = async (userInfo, cache, mq) => {
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
      userId: uuid(),
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
    if (!checkSend || checkSend !== 1) {
      new EmailMsg(mq).send({
        to: email,
      });
      cache.hincrby('email-welcome', email, 1);
    }
  }
  shareInfo.userId = user.userId;
  createGithubShare(shareInfo);

  new SlackMsg(mq).send(msg);

  return Promise.resolve({
    success: true,
    result: user.userId
  });
};

const findPinnedRepos = async (login) => {
  try {
    const user = await findUserByLogin(login);
    return Promise.resolve(user.pinnedRepos);
  } catch (err) {
    logger.error(err);
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
    logger.error(err);
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
    logger.error(err);
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
    logger.error(err);
    return Promise.resolve({
      success: false
    });
  }
};

const findAll = async () => await User.find({});

export default {
  loginWithGithub,
  findUserByLogin,
  updateUser,
  updateUserInfo,
  updateUserOrgs,
  findGithubSections,
  updateGithubSections,
  findPinnedRepos,
  updatePinnedRepos,
  findAll,
  findOne: findUser,
};

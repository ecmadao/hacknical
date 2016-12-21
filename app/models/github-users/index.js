import GithubUsers from './schema';

const findGithubUsers = async (userId) => {
  return await GithubUsers.findOne({ userId });
};

const setReposIds = async (userId, reposIds) => {
  const findResult = await findGithubUsers(userId);
  if (findResult) {
    findResult.reposIds = reposIds;
    await findResult.save();
    return Promise.resolve({
      success: true
    });
  }
  return Promise.resolve({
    success: false,
    message: '没有找到数据'
  });
};

const getReposIds = async (userId) => {
  const findResult = await findGithubUsers(userId);
  if (findResult) {
    return Promise.resolve({
      success: true,
      result: findResult.reposIds
    });
  }
  return Promise.resolve({
    success: false,
    message: '没有找到数据'
  });
};

export default {
  setReposIds,
  getReposIds
}

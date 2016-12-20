import GithubUsers from './schema';

const findGithubUsers = async (githubId) => {
  return await GithubUsers.findOne({ githubId });
};

const setReposIds = async (githubId, reposIds) => {
  const findResult = await findGithubUsers(githubId);
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

const getReposIds = async (githubId) => {
  const findResult = await findGithubUsers(githubId);
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

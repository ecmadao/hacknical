import GithubCommits from './schema';

const addUserCommits = async (userId, datas) => {
  for(let i = 0; i < datas.length; i++) {
    const data = datas[i];
    const {
      reposId,
      commits,
      name
    } = data;
    await GithubCommits.create({
      name,
      userId,
      reposId,
      commits
    });
  }
  return Promise.resolve({
    success: true
  });
};

const getUserCommits = async (userId) => {
  const findResults = await GithubCommits.find({ userId });
  return Promise.resolve({
    success: true,
    result: findResults
  });
};

const getUserReposCommits = async (userId, reposId) => {
  const findResult = await GithubCommits.findOne({
    userId,
    reposId
  });
  return Promise.resolve({
    success: true,
    result: findResult
  });
};

export default {
  addUserCommits,
  getUserCommits,
  getUserReposCommits
}

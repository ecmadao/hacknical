import GithubCommits from './schema';

const addUserCommits = async (userId, datas) => {
  for(let i = 0; i < datas.length; i++) {
    const data = datas[i];
    const {
      reposId,
      commits,
      name,
      created_at,
      pushed_at,
      totalCommits
    } = data;
    await GithubCommits.create({
      name,
      userId,
      reposId,
      commits,
      created_at,
      pushed_at,
      totalCommits
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

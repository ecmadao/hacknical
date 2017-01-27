import GithubCommits from './schema';

const clearUserCommits = async (userId) => {
  return await GithubCommits.remove({
    userId
  });
};

const setCommits = async (userId, datas) => {
  await clearUserCommits(userId);
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

const getCommits = async (userId) => {
  const findResults = await GithubCommits.find({ userId });
  return findResults;
};

const getReposCommits = async (userId, reposId) => {
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
  setCommits,
  getCommits,
  getReposCommits
}


import config from 'config';
import Records from '../../app/models/records';
import { getRedis } from '../../app/middlewares/cache';
import UserAPI from '../../app/services/user';
import getMongo from '../../app/utils/database';

const redisUrl = config.get('database.redis');

const init = async () => {
  try {
    const cache = getRedis({
      url: redisUrl
    });
    const userCount = await UserAPI.getUserCount();
    const resumeCount = await UserAPI.getResumeCount();

    const db = await getMongo();
    const col = db.collection('records');
    const records = await col.find({}).toArray();

    console.log(`users: ${userCount}`);
    console.log(`resumes: ${resumeCount}`);

    await cache.incrby('users', userCount);
    await cache.hincrby('github', 'count', userCount);
    await cache.hincrby('resume', 'count', resumeCount);

    let githubPageview = 0;
    let resumePageview = 0;

    records.forEach((analyse) => {
      const { login, pageViews } = analyse;
      const viewCount = pageViews.reduce((prev, current) => {
        let count = parseInt(current.count, 10);
        if (Number.isNaN(count)) count = 0;
        return count + prev;
      }, 0);
      if (login) {
        githubPageview += viewCount;
      } else {
        resumePageview += viewCount;
      }
    });
    await cache.hincrby('github', 'pageview', githubPageview);
    await cache.hincrby('resume', 'pageview', resumePageview);

    console.log('cache initial finished!');
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
};

init();

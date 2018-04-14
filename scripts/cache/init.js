import config from 'config';
import Users from '../../app/models/users';
import Resumes from '../../app/models/resumes';
import ShareAnalyse from '../../app/models/share-analyse';
import { getRedis } from '../../app/middlewares/cache';

const redisUrl = config.get('database.redis');

const init = async () => {
  try {
    const cache = getRedis({
      url: redisUrl
    });
    const users = await Users.findAll();
    const resumes = await Resumes.findAll();
    const allAnalyse = await ShareAnalyse.findAll();

    console.log(`users: ${users.length}`);
    console.log(`resumes: ${resumes.length}`);

    await cache.incrby('users', users.length);
    await cache.hincrby('github', 'count', users.length);
    await cache.hincrby('resume', 'count', resumes.length);

    let githubPageview = 0;
    let resumePageview = 0;

    allAnalyse.forEach((analyse) => {
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

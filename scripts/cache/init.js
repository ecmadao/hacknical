
import config from 'config';
import { getRedis } from '../../app/middlewares/cache';
import UserAPI from '../../app/services/user';
import StatAPI from '../../app/services/stat';

const redisUrl = config.get('database.redis');

const init = async () => {
  try {
    const cache = getRedis({
      url: redisUrl
    });
    const userCount = await UserAPI.getUserCount();
    const resumeCount = await UserAPI.getResumeCount();
    const records = await StatAPI.getAllRecords();

    console.log(`users: ${userCount}`);
    console.log(`resumes: ${resumeCount}`);

    await StatAPI.putStat({
      type: 'github',
      action: 'count',
      count: userCount
    });
    await StatAPI.putStat({
      type: 'resume',
      action: 'count',
      count: resumeCount
    });

    let githubPageview = 0;
    let resumePageview = 0;

    for (const record of records) {
      const { type, pageViews } = record;
      const viewCount = pageViews.reduce((prev, current) => {
        let count = parseInt(current.count, 10);
        if (Number.isNaN(count)) count = 0;
        return count + prev;
      }, 0);
      if (type === 'github') {
        githubPageview += viewCount;
      } else {
        resumePageview += viewCount;
      }
    }

    await StatAPI.putStat({
      type: 'github',
      action: 'pageview',
      count: githubPageview
    });
    await StatAPI.putStat({
      type: 'resume',
      action: 'pageview',
      count: resumePageview
    });

    console.log('cache initial finished!');
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
};

init();

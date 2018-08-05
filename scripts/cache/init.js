
import config from 'config';
import { getRedis } from '../../app/middlewares/cache';
import network from '../../app/services/network';

const redisUrl = config.get('database.redis');

const init = async () => {
  try {
    const cache = getRedis({
      url: redisUrl
    });
    const userCount = await network.user.getUserCount();
    const resumeCount = await network.user.getResumeCount();
    const records = await network.stat.getAllRecords();

    console.log(`users: ${userCount}`);
    console.log(`resumes: ${resumeCount}`);

    await network.stat.putStat({
      type: 'github',
      action: 'count',
      count: userCount
    });
    await network.stat.putStat({
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

    await network.stat.putStat({
      type: 'github',
      action: 'pageview',
      count: githubPageview
    });
    await network.stat.putStat({
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

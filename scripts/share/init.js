import config from 'config';
import Users from '../../app/models/users';
import ResumePub from '../../app/models/resume-pub';
import { getRedis } from '../../app/middlewares/cache';

const redisUrl = config.get('redis');

const init = async () => {
  try {
    const cache = getRedis({
      url: redisUrl
    });
    cache.hdel('share-resume-hash', undefined);
    cache.hdel('share-resume-hash', 'undefined');
    cache.hdel('resume-hash-map', undefined);
    cache.hdel('resume-hash-map', 'undefined');
    const resumePubs = await ResumePub.find();
    for (let i = 0; i < resumePubs.length; i += 1) {
      const resumePub = resumePubs[i];
      const {
        userId,
        openShare,
        resumeHash,
        resumeHashV0,
        simplifyUrl,
      } = resumePub;
      const user = await Users.findOne({ userId });
      if (!user) continue;
      const { githubLogin, githubInfo } = user;
      const login = githubLogin || githubInfo.login;
      if (simplifyUrl && resumeHash) await cache.hset('share-resume-login', login, JSON.stringify({
        userId,
        openShare,
        resumeHash,
      }));
      if (resumeHash) await cache.hset('share-resume-hash', resumeHash, JSON.stringify({
        login,
        userId,
        openShare,
      }));
      if (resumeHashV0 && resumeHash) await cache.hset('resume-hash-map', resumeHashV0, resumeHash);
      console.log(`resume cache finished for ${login}`);
    }
    console.log('resume cache initial finished!');
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
};

init();

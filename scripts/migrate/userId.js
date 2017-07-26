import uuid from 'uuid/v4';
import User from '../../app/models/users';
import Resumes from '../../app/models/resumes';
import ShareAnalyse from '../../app/models/share-analyse';
import ResumePub from '../../app/models/resume-pub';

const updateData = async (datas, userId) => {
  if (!datas || !datas.length) return;
  for (let i = 0; i < datas.length; i += 1) {
    const data = datas[i];
    data.userId = userId;
    await data.save();
  }
};

const migrateUserId = async () => {
  try {
    const users = await User.findAll();

    for (let i = 0; i < users.length; i += 1) {
      const userId = uuid();
      const user = users[i];
      try {
        if (user.userId) {
          console.log(`[ALREADY HAS] ${user.userName}:${user.githubInfo.login}`);
        } else {
          user.userId = userId;
          await user.save();

          const resumes = await Resumes.find({ userId: user._id });
          await updateData(resumes, userId);

          const shareAnalyses = await ShareAnalyse.find({ userId: user._id });
          await updateData(shareAnalyses, userId);

          const resumePubs = await ResumePub.find({ userId: user._id });
          await updateData(resumePubs, userId);

          console.log(`[SUCCESS] ${user.userName}:${user.githubInfo.login}`);
        }
      } catch (e) {
        console.log(`[ERROR] ${user.userName}:${user.githubInfo.login}`);
        console.log(e);
      }
    }
  } catch (e) {
    console.log(e);
  }
  process.exit();
};

migrateUserId();

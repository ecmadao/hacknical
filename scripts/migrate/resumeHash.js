import shortid from 'shortid';
import ResumePub from '../../app/models/resume-pub';
import ShareAnalyse from '../../app/models/share-analyse';

const migrateResumeHash = async () => {
  try {
    // migrate resume
    const resumes = await ResumePub.find();
    for (let i = 0; i < resumes.length; i += 1) {
      const resume = resumes[i];
      const hash = shortid.generate();
      const { resumeHash } = resume;
      resume.resumeHash = hash;
      resume.resumeHashV0 = resumeHash;
      await resume.save();

      // migrate share
      const share = await ShareAnalyse.findOne({
        url: `resume/${resumeHash}`
      });
      if (share) {
        share.url = `resume/${hash}`;
        await share.save();
      }
    }
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
};

migrateResumeHash();

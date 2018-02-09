import mongoose from '../mongoose';

const MongoSchema = mongoose.Schema;

const ResumePubSchema = new MongoSchema({
  userId: String,
  maxView: Number,
  resumeHashV0: String,
  resumeHash: String,
  openShare: { type: Boolean, default: true },
  useGithub: { type: Boolean, default: true },
  simplifyUrl: { type: Boolean, default: true },
  template: { type: String, default: 'v1' },
  github: {
    hotmap: { type: Boolean, default: true },
    info: { type: Boolean, default: true },
    repos: { type: Boolean, default: true },
    languages: { type: Boolean, default: true },
    commits: { type: Boolean, default: true },
    orgs: { type: Boolean, default: true },
    course: { type: Boolean, default: true },
    contributed: { type: Boolean, default: true },
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

ResumePubSchema.index({
  userId: 1,
  resumeHashV0: 1,
  resumeHash: 1,
});

export default mongoose.model('ResumePub', ResumePubSchema);

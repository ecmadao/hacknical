import mongoose from '../mongoose/index';

const Schema = mongoose.Schema;

const ResumeSchema = new Schema({
  userId: String,
  resume: {
    info: {
      name: String,
      email: String,
      phone: String,
      gender: String,
      location: String,
      avator: String,
      intention: String,
      hireAvailable: { type: Boolean, default: false },
    },
    educations: [{
      school: String,
      major: String,
      education: String,
      startTime: String,
      endTime: String
    }],
    workExperiences: [{
      company: String,
      url: String,
      startTime: String,
      endTime: String,
      untilNow: { type: Boolean, default: false },
      position: String,
      projects: [{
        name: String,
        details: Array,
        url: { type: String, default: '' }
      }]
    }],
    personalProjects: [{
      url: String,
      title: String,
      desc: String,
      techs: Array
    }],
    others: {
      expectLocation: String,
      expectLocations: Array,
      expectSalary: String,
      dream: String,
      supplements: Array,
      socialLinks: [{
        name: String,
        icon: String,
        url: String
      }]
    }
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.model('Resumes', ResumeSchema);

import {
  EDUCATIONS,
  SOCIAL_LINKS
} from '../helper/const_value';

export const INFO = {
  name: '',
  email: '',
  phone: '',
  gender: 'male',
  location: '',
  avator: '',
  intention: ''
};

export const EDU = {
  school: '',
  major: '',
  education: EDUCATIONS[0].id,
  startTime: '',
  endTime: '',
};

export const WORK_EXPERIENCE = {
  company: '',
  url: '',
  startTime: '',
  endTime: '',
  position: '',
  projects: []
};

export const WORK_PROJECT = {
  name: '',
  details: []
};

export const PERSONAL_PROJECT = {
  url: '',
  desc: '',
  title: '',
  techs: []
};

export const OTHERS = {
  expectLocation: '',
  expectLocations: [],
  expectSalary: '',
  dream: '',
  supplements: [],
  socialLinks: [...SOCIAL_LINKS]
};

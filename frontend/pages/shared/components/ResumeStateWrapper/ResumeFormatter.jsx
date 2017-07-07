import React, { cloneElement } from 'react';
import objectAssign from 'UTILS/object-assign';
import {
  validateSocialLinks
} from 'SHARED/utils/resume';
import validator from 'UTILS/validator';
import dateHelper from 'UTILS/date';
import { sortBySeconds, validateUrl } from 'UTILS/helper';
import {
  LINK_NAMES
} from 'SHARED/datas/resume';

const getDateNow = dateHelper.date.now;
const validateDate = dateHelper.validator.date;
const DATE_NOW = getDateNow();
const sortByDate = sortBySeconds('startTime');

const formatResume = (resume) => {
  const {
    others,
    educations,
    workExperiences,
    personalProjects,
  } = resume;
  const { socialLinks } = others;

  const formatWorkExperiences = workExperiences
    .filter(experience => experience.company)
    .sort(sortByDate)
    .reverse()
    .map((experience) => {
      const {
        url,
        company,
        startTime,
        endTime,
        position,
        projects,
        untilNow,
      } = experience;

      const validateEnd = untilNow
        ? validateDate(DATE_NOW)
        : validateDate(endTime);

      return {
        url,
        company,
        position,
        untilNow,
        endTime: validateEnd,
        startTime: validateDate(startTime),
        projects: projects.filter(project => project.name)
      };
    });

  const formatEducations = educations
    .filter(edu => edu.school)
    .sort(sortByDate)
    .reverse()
    .map((edu, index) => {
      const {
        school,
        major,
        education,
        startTime,
        endTime
      } = edu;

      return {
        school,
        major,
        education,
        startTime: validateDate(startTime),
        endTime: validateDate(endTime),
      };
    });

  const formatPersonalProjects = personalProjects
    .filter(project => project.title);

  const formatSocials = validateSocialLinks(socialLinks)
    .filter(social => validator.url(social.url))
    .map((social) => {
      const { url, name, text } = social;
      return {
        url,
        text: text || LINK_NAMES[name] || name,
        validateUrl: validateUrl(url),
      };
    });

  return objectAssign({}, resume, {
    educations: [...formatEducations],
    workExperiences: [...formatWorkExperiences],
    personalProjects: [...formatPersonalProjects],
    others: objectAssign({}, others, {
      socialLinks: formatSocials
    })
  });
}

const ResumeFormatter = (props) => {
  const { resume, children } = props;
  const componentProps = objectAssign({}, props);
  delete componentProps.resume;
  delete componentProps.children;

  const component = cloneElement(children, {
    ...componentProps,
    resume: formatResume(resume),
  });
  return component;
};

export default ResumeFormatter;

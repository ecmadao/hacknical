
import { cloneElement } from 'react';
import objectAssign from 'UTILS/object-assign';
import { validateSocialLinks } from 'UTILS/resume';
import dateHelper from 'UTILS/date';
import { sortBySeconds, isUrl } from 'UTILS/helper';
import { formatUrl } from 'UTILS/formatter';
import { LINK_NAMES } from 'UTILS/constant/resume';

const validateDate = dateHelper.validator.date;
const sortByDate = sortBySeconds('startTime');
const getLinkText = social =>
  social.text
  || LINK_NAMES[social.name]
  || LINK_NAMES[social.name.toLowerCase()]
  || social.name;

const formatResume = (resume) => {
  const {
    others,
    educations,
    workExperiences,
    personalProjects,
    customModules = [],
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
        ? '至今'
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
    .map((edu) => {
      const {
        major,
        school,
        endTime,
        education,
        startTime,
        experiences = []
      } = edu;

      return {
        school,
        major,
        education,
        experiences,
        endTime: validateDate(endTime),
        startTime: validateDate(startTime),
      };
    });

  const formatPersonalProjects = personalProjects
    .filter(project => project.title);

  const formatSocials = validateSocialLinks(socialLinks)
    .filter(social => isUrl(social.url))
    .map((social) => {
      const { url } = social;
      return {
        url,
        text: getLinkText(social),
        validateUrl: formatUrl(url),
      };
    });

  return objectAssign({}, resume, {
    educations: [...formatEducations],
    workExperiences: [...formatWorkExperiences],
    personalProjects: [...formatPersonalProjects],
    others: objectAssign({}, others, {
      socialLinks: formatSocials
    }),
    customModules: customModules.filter(module => module.text)
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

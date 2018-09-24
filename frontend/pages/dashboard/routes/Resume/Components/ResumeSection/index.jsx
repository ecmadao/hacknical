
import React from 'react';
import asyncComponent from 'COMPONENTS/AsyncComponent';
import locales from 'LOCALES';

const resumeTexts = locales('resume');

const sections = {
  info: asyncComponent(
    () => System.import('./Info')
      .then(component => component.default)
  ),
  educations: asyncComponent(
    () => System.import('./Educations')
      .then(component => component.default)
  ),
  workExperiences: asyncComponent(
    () => System.import('./WorkExperiences')
      .then(component => component.default)
  ),
  personalProjects: asyncComponent(
    () => System.import('./PersonalProjects')
      .then(component => component.default)
  ),
  others: asyncComponent(
    () => System.import('./Others')
      .then(component => component.default)
  ),
  custom: asyncComponent(
    () => System.import('./CustomModule')
      .then(component => component.default)
  ),
};

const ResumeSection = (props) => {
  const { section } = props;
  const Section = sections[section] || sections.custom;
  const title = resumeTexts.sections[section] ? resumeTexts.sections[section].title : section;
  return (
    <Section {...props} title={title} />
  );
};

export default ResumeSection;

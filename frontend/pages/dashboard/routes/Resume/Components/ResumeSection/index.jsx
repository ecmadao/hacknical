
import React from 'react';
import asyncComponent from 'SHARED/components/AsyncComponent';

import Info from './Info';
import Educations from './Educations';
import WorkExperiences from './WorkExperiences';
import PersonalProjects from './PersonalProjects';
import Others from './Others';


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
};

const ResumeSection = (props) => {
  const Section = sections[props.section];
  return (
    <Section {...props} />
  );
};

export default ResumeSection;

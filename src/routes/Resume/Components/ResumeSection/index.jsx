import React from 'react';
import Info from './Info';
import Educations from './Educations';
import WorkExperiences from './WorkExperiences';
import PersonalProjects from './PersonalProjects';
import Others from './Others';

const sections = {
  info: Info,
  educations: Educations,
  workExperiences: WorkExperiences,
  personalProjects: PersonalProjects,
  others: Others
};

const ResumeSection = (props) => {
  const Section = sections[props.section];
  return <Section />
}

export default ResumeSection;

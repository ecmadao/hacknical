import React from 'react';
import Info from './Info';
import Educations from './Educations';
import WorkExperiences from './WorkExperiences';
import PersonalProjects from './PersonalProjects';
import Others from './Others';
import objectAssign from 'UTILS/object-assign';

const sections = {
  info: Info,
  educations: Educations,
  workExperiences: WorkExperiences,
  personalProjects: PersonalProjects,
  others: Others
};

const ResumeSection = (props) => {
  const Section = sections[props.section];
  const newProps = objectAssign({}, props);
  delete newProps.section;
  return (
    <Section {...newProps} />
  );
};

export default ResumeSection;

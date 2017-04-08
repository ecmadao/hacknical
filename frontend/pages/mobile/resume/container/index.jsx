import React from 'react';
import objectAssign from 'object-assign';
import ResumeStateWrapper from 'SHARED/components/ResumeStateWrapper';
import ResumeContent from './ResumeContent';
import styles from '../styles/resume.css';

const ResumeMobileShare = (props) => {
  return (
    <ResumeStateWrapper {...props} className={styles.container}>
      <ResumeContent />
    </ResumeStateWrapper>
  )
};

export default ResumeMobileShare

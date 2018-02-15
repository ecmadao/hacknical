import React from 'react';
import PropTypes from 'prop-types';
import ResumeWrapper from 'SHARED/components/ResumeWrapper';
import ResumeContent from './ResumeContent';
import styles from '../styles/resume.css';

const ResumeMobileComponent = props => (
  <ResumeWrapper {...props} className={styles.container}>
    <ResumeContent />
  </ResumeWrapper>
);

ResumeMobileComponent.propTypes = {
  hash: PropTypes.string,
  login: PropTypes.string
};

ResumeMobileComponent.defaultProps = {
  hash: window.resumeHash,
  login: window.login,
};

export default ResumeMobileComponent;

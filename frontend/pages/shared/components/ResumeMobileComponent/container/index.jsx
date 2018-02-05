import React from 'react';
import PropTypes from 'prop-types';
import ResumeStateWrapper from 'SHARED/components/ResumeStateWrapper';
import ResumeContent from './ResumeContent';
import styles from '../styles/resume.css';

const ResumeMobileComponent = props => (
  <ResumeStateWrapper {...props} className={styles.container}>
    <ResumeContent />
  </ResumeStateWrapper>
);

ResumeMobileComponent.propTypes = {
  hash: PropTypes.string,
  login: PropTypes.string
};

ResumeMobileComponent.defaultProps = {
  hash: '',
  login: window.login,
};

export default ResumeMobileComponent;

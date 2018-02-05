import React from 'react';
import PropTypes from 'prop-types';
import ResumeStateWrapper from 'SHARED/components/ResumeStateWrapper';
import ResumeContent from './ResumeContent';
import styles from '../styles/resume.css';

const ResumeMobileShare = props => (
  <ResumeStateWrapper {...props} className={styles.container}>
    <ResumeContent />
  </ResumeStateWrapper>
);

ResumeMobileShare.propTypes = {
  hash: PropTypes.string,
  login: PropTypes.string
};

ResumeMobileShare.defaultProps = {
  hash: '',
  login: window.login,
};

export default ResumeMobileShare;

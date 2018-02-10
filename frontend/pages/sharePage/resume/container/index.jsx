import React from 'react';
import PropTypes from 'prop-types';
import ResumeComponent from 'SHARED/components/ResumeComponent';
import ResumeStateWrapper from 'SHARED/components/ResumeStateWrapper';
import styles from '../styles/share.css';

const ResumeShare = props => (
  <ResumeStateWrapper {...props} className={styles.container}>
    <ResumeComponent />
  </ResumeStateWrapper>
);

ResumeShare.propTypes = {
  hash: PropTypes.string,
  login: PropTypes.string
};

ResumeShare.defaultProps = {
  hash: window.resumeHash,
  login: window.login,
};

export default ResumeShare;

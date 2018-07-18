import React from 'react';
import PropTypes from 'prop-types';
import ResumeComponent from 'SHARED/components/Resume/Desktop';
import ResumeWrapper from 'SHARED/components/ResumeWrapper';
import styles from '../styles/share.css';

const ResumeShare = props => (
  <ResumeWrapper {...props} className={styles.container}>
    <ResumeComponent />
  </ResumeWrapper>
);

ResumeShare.propTypes = {
  login: PropTypes.string,
  userId: PropTypes.string,
};

ResumeShare.defaultProps = {
  login: window.login,
  userId: window.userId,
};

export default ResumeShare;

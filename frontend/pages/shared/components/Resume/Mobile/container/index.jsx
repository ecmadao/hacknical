
import React from 'react'
import PropTypes from 'prop-types'
import ResumeWrapper from 'SHARED/components/ResumeWrapper'
import ResumeContent from './ResumeContent'
import styles from '../styles/resume.css'

const ResumeMobileComponent = props => (
  <ResumeWrapper {...props} className={styles.container}>
    <ResumeContent />
  </ResumeWrapper>
)

ResumeMobileComponent.propTypes = {
  login: PropTypes.string,
  userId: PropTypes.string,
  fromDownload: PropTypes.bool
}

ResumeMobileComponent.defaultProps = {
  login: window.login,
  userId: window.userId,
  fromDownload: window.fromDownload === 'true' || window.fromDownload === true
}

export default ResumeMobileComponent

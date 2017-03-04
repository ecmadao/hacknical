import React, { PropTypes } from 'react';
import cx from 'classnames';
import Api from 'API/index';
import ResumeComponent from 'SHAREDPAGE/components/ResumeComponent';
import ResumeDownloader from 'SHAREDPAGE/components/ResumeDownloader';
import {
  EDU,
  INFO,
  OTHERS,
  WORK_EXPERIENCE,
  WORK_PROJECT,
  PERSONAL_PROJECT,
  SOCIAL_LINKS
} from 'SHAREDPAGE/datas/resume';
import {
  objectassign,
  validateSocialLinks
} from 'SHAREDPAGE/utils/resume';
import styles from '../styles/share.css';

class ResumeShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      info: objectassign({}, INFO),
      educations: [],
      workExperiences: [],
      personalProjects: [],
      others: objectassign({}, OTHERS),
      shareInfo: {
        github: {},
        useGithub: true
      }
    };
  }

  componentDidMount() {
    this.fetchResume();
    this.fetchShareInfo();
  }

  fetchShareInfo() {
    Api.resume.getPubResumeStatus().then((result) => {
      this.initialShareInfo(result);
    });
  }

  fetchResume() {
    Api.resume.getPubResume(this.props.hash).then((result) => {
      result && this.initialResume(result);
    });
  }

  initialShareInfo(data) {
    const { shareInfo } = this.state;
    this.setState({
      shareInfo: objectassign(shareInfo, data)
    });
  }

  initialResume(resume) {
    const {
      info,
      educations,
      workExperiences,
      personalProjects,
      others
    } = resume;
    const state = this.state;
    this.setState({
      loading: false,
      info: objectassign(state.info, info),
      educations: [...educations],
      workExperiences: [...workExperiences],
      personalProjects: [...personalProjects],
      others: objectassign(state.others, objectassign(others, {
        socialLinks: [...validateSocialLinks(others.socialLinks)]
      }))
    })
  }

  render() {
    return (
      <div className={styles.container}>
        <ResumeComponent
          login={this.props.login}
          resume={this.state}
          shareInfo={this.state.shareInfo}
        />
        {/* <ResumeDownloader
          resume={this.state}
        /> */}
      </div>
    )
  }
}

ResumeShare.propTypes = {
  hash: PropTypes.string,
  login: PropTypes.string
};

ResumeShare.defaultProps = {
  hash: '',
  login: ''
};

export default ResumeShare;

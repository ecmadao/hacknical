import React, { PropTypes } from 'react';
import cx from 'classnames';
import objectAssign from 'object-assign';
import Api from 'API/index';
import ResumeComponent from 'SHARED/components/ResumeComponent';
import {
  EDU,
  INFO,
  OTHERS,
  WORK_EXPERIENCE,
  WORK_PROJECT,
  PERSONAL_PROJECT,
  SOCIAL_LINKS
} from 'SHARED/datas/resume';
import {
  objectassign,
  validateSocialLinks
} from 'SHARED/utils/resume';
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
        useGithub: true,
        githubUrl: null
      }
    };
  }

  componentDidMount() {
    this.fetchResume();
    this.removeLoading('#loading');
    this.fetchShareInfo();
  }

  componentDidUpdate(preProps, preState) {
    const { loading } = this.state;
    if(!loading && preState.loading) {
      window.done = true;
    }
  }

  removeLoading(dom) {
    $(dom) && $(dom).remove();
  }

  fetchShareInfo() {
    Api.resume.getPubResumeStatus(this.props.hash).then((result) => {
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
    const resumeProps = objectAssign({}, this.state);
    const shareInfo = objectAssign({}, resumeProps.shareInfo);
    delete resumeProps.shareInfo;

    return (
      <div className={styles.container}>
        <ResumeComponent
          login={this.props.login}
          resume={resumeProps}
          shareInfo={shareInfo}
        />
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

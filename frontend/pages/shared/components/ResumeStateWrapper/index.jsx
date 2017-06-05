import React, { cloneElement } from 'react';
import objectAssign from 'object-assign';
import Api from 'API/index';
import {
  objectassign,
  validateSocialLinks
} from 'SHARED/utils/resume';
import {
  EDU,
  INFO,
  OTHERS,
  WORK_EXPERIENCE,
  WORK_PROJECT,
  PERSONAL_PROJECT,
  SOCIAL_LINKS
} from 'SHARED/datas/resume';

class ResumeStateWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      updateAt: '',
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
      others,
      updateAt
    } = resume;

    const state = this.state;
    this.setState({
      updateAt,
      loading: false,
      info: objectassign(state.info, info),
      educations: [...educations],
      workExperiences: [...workExperiences],
      personalProjects: [...personalProjects],
      others: objectassign(state.others, objectassign(others, {
        socialLinks: [...validateSocialLinks(others.socialLinks)]
      }))
    });
  }

  render() {
    const resumeProps = objectassign(this.state);
    const shareInfo = objectassign(resumeProps.shareInfo);
    delete resumeProps.shareInfo;
    delete resumeProps.loading;

    const children = cloneElement(this.props.children, {
      login: this.props.login,
      resume: resumeProps,
      shareInfo: shareInfo,
      loading: this.state.loading
    });
    return (
      <div className={this.props.className}>
        {children}
      </div>
    );
  }
}

export default ResumeStateWrapper;

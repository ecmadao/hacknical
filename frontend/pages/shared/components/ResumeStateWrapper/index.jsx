import React from 'react';
import objectAssign from 'UTILS/object-assign';
import Api from 'API/index';
import {
  EDU,
  INFO,
  OTHERS,
  WORK_EXPERIENCE,
  WORK_PROJECT,
  PERSONAL_PROJECT,
  SOCIAL_LINKS,
} from 'SHARED/datas/resume';
import locales from 'LOCALES';
import ResumeFormatter from './ResumeFormatter';

const resumeTexts = locales("resume");

class ResumeStateWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      updateAt: '',
      info: objectAssign({}, INFO),
      educations: [],
      workExperiences: [],
      personalProjects: [],
      others: objectAssign({}, OTHERS),
      shareInfo: {
        github: {},
        useGithub: true,
        githubUrl: null,
        template: 'v0'
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
      shareInfo: objectAssign({}, shareInfo, data)
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
      others: objectAssign({}, state.others, others),
      info: objectAssign({}, state.info, info),
      educations: [...educations],
      workExperiences: [...workExperiences],
      personalProjects: [...personalProjects],
    });
  }

  render() {
    const {
      login,
      children,
      className,
    } = this.props;
    const resumeProps = objectAssign({}, this.state);
    const shareInfo = objectAssign({}, resumeProps.shareInfo);
    delete resumeProps.shareInfo;
    delete resumeProps.loading;

    return (
      <div className={className}>
        <ResumeFormatter
          login={login}
          resume={resumeProps}
          shareInfo={shareInfo}
          loading={this.state.loading}
          updateText={resumeTexts.updateAt}
        >
          {children}
        </ResumeFormatter>
      </div>
    );
  }
}

export default ResumeStateWrapper;

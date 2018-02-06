import React from 'react';
import objectAssign from 'UTILS/object-assign';
import Api from 'API';
import {
  INFO,
  OTHERS,
} from 'SHARED/datas/resume';
import locales from 'LOCALES';
import ResumeFormatter from './ResumeFormatter';

const resumeTexts = locales('resume');

class ResumeStateWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: props.hash,
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
    this.fetchResumeData();
    this.removeLoading('#loading');
  }

  componentDidUpdate(preProps, preState) {
    const { loading } = this.state;
    if (!loading && preState.loading) {
      window.done = true;
    }
  }

  removeLoading(dom) {
    $(dom) && $(dom).remove();
  }

  async fetchResumeData() {
    let { hash } = this.state;
    const { login } = this.props;
    if (!hash) {
      hash = await Api.resume.getPubResumeHash(login);
      this.setState({ hash });
    }
    this.fetchResume(hash);
    this.fetchShareInfo(hash);
  }

  fetchShareInfo(hash) {
    Api.resume.getPubResumeStatus(hash).then((result) => {
      this.initialShareInfo(result);
    });
  }

  fetchResume(hash) {
    Api.resume.getPubResume(hash).then((result) => {
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

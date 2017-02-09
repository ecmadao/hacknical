import React, { PropTypes } from 'react';
import cx from 'classnames';
import Api from 'API/index';
import objectAssign from 'object-assign';
import ResumeComponent from 'SHAREDPAGE/ResumeComponent';
import {
  EDU,
  INFO,
  OTHERS,
  WORK_EXPERIENCE,
  WORK_PROJECT,
  PERSONAL_PROJECT,
  SOCIAL_LINKS
} from 'SHAREDPAGE/datas/resume';

class ResumeShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      info: objectAssign({}, INFO),
      educations: [],
      workExperiences: [],
      personalProjects: [],
      others: objectAssign({}, OTHERS)
    }
  }

  componentDidMount() {
    this.fetchResume();
  }

  fetchResume() {
    Api.resume.getPubResume(this.props.hash).then((result) => {
      result && this.initialResume(result);
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
      <div>
        <ResumeComponent
          openModal={true}
          {...this.state}
        />
      </div>
    )
  }
}

ResumeShare.propTypes = {
  hash: PropTypes.string
};

ResumeShare.defaultProps = {
  hash: ''
};

export default ResumeShare;

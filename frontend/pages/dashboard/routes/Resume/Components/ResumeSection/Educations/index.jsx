import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import resumeActions from '../../../redux/actions';
import Education from './Education';
import locales from 'LOCALES';
import { SectionWrapper } from '../components';

const resumeTexts = locales('resume').sections.edu;

class Educations extends React.Component {
  constructor(props) {
    super(props);
    this.deleteEdu = this.deleteEdu.bind(this);
    this.handleEduChange = this.handleEduChange.bind(this);
  }

  handleEduChange(index) {
    const { actions } = this.props;
    return type => (value) => {
      actions.handleEduChange({ [type]: value }, index);
    };
  }

  deleteEdu(index) {
    const { actions } = this.props;
    return () => {
      actions.deleteEducation(index);
    };
  }

  renderEdu() {
    const { educations, disabled, freshGraduate } = this.props;
    return educations.map((edu, index) => (
      <Education
        edu={edu}
        key={index}
        index={index}
        disabled={disabled}
        freshGraduate={freshGraduate}
        deleteEdu={this.deleteEdu(index)}
        handleEduChange={this.handleEduChange(index)}
      />
    ));
  }

  render() {
    const { actions, disabled } = this.props;
    return (
      <SectionWrapper
        disabled={disabled}
        title={resumeTexts.title}
        button={resumeTexts.mainButton}
        onClick={actions.addEducation}
      >
        {this.renderEdu()}
      </SectionWrapper>
    );
  }
}

function mapStateToProps(state) {
  const { educations, info } = state.resume;
  return {
    educations,
    freshGraduate: info.freshGraduate,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(resumeActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Educations);

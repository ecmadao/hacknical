import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'light-ui';

import actions from '../../../redux/actions';
import Education from './Education';
import styles from '../../../styles/resume.css';
import locales from 'LOCALES';

const resumeTexts = locales("resume").sections.edu;

class Educations extends React.Component {
  constructor(props) {
    super(props);
    this.deleteEdu = this.deleteEdu.bind(this);
    this.handleEduChange = this.handleEduChange.bind(this);
  }

  handleEduChange(index) {
    const {actions} = this.props;
    return (type) => (value) => {
      actions.handleEduChange({[type]: value}, index);
    }
  }

  deleteEdu(index) {
    const {actions} = this.props;
    return () => {
      actions.deleteEducation(index);
    }
  }

  renderEdu() {
    const {educations} = this.props;
    return educations.map((edu, index) => {
      return (
        <Education
          key={index}
          edu={edu}
          index={index}
          deleteEdu={this.deleteEdu(index)}
          handleEduChange={this.handleEduChange(index)}
        />
      )
    });
  }

  render() {
    const { actions } = this.props;
    return (
      <div className={styles["resume_section_container"]}>
        <div className={styles["section_title"]}>
          {resumeTexts.title}
        </div>
        <div>
          {this.renderEdu()}
        </div>
        <div className={styles["resume_button_container"]}>
          <Button
            theme="flat"
            value={resumeTexts.mainButton}
            leftIcon={(
              <i className="fa fa-plus-circle" aria-hidden="true"></i>
            )}
            onClick={actions.addEducation}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { educations } = state.resume;
  return { educations }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Educations);

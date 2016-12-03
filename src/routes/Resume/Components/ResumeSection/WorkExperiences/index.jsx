import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

import actions from '../../../redux/actions';
import WorkExperience from './WorkExperience';

class WorkExperiences extends React.Component {
  constructor(props) {
    super(props);
    this.deleteExperience = this.deleteExperience.bind(this);
    this.handleExperienceChange = this.handleExperienceChange.bind(this);
  }

  handleExperienceChange(index) {
    const {actions} = this.props;
    return (type) => (value) => {
      actions.handleWorkExperienceChange({[type]: value}, index);
    }
  }

  deleteExperience(index) {
    const {actions} = this.props;
    return () => {
      actions.deleteWorkExperience(index);
    }
  }

  renderExperience() {
    const {workExperiences} = this.props;
    return workExperiences.map((workExperience, index) => {
      return (
        <WorkExperience
          key={index}
          index={index}
          workExperience={workExperience}
          deleteExperience={this.deleteExperience(index)}
          handleExperienceChange={this.handleExperienceChange(index)}
        />
      )
    });
  }

  render() {
    const {actions} = this.props;
    return (
      <div>
        <div>
          {this.renderExperience()}
        </div>
        <div
          className="resume_add"
          onClick={actions.addWorkExperience}>
          <i className="fa fa-plus-circle" aria-hidden="true"></i>
          &nbsp;&nbsp;&nbsp;
          添加工作经历
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {workExperiences} = state.resume;
  return {workExperiences}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkExperiences);

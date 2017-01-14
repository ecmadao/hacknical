import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

import actions from '../../../redux/actions';
import WorkExperience from './WorkExperience';
import Button from 'COMPONENTS/Button';
import styles from '../../../styles/resume.css';


class WorkExperiences extends React.Component {
  constructor(props) {
    super(props);
    this.addProject = this.addProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.handleProjectChange = this.handleProjectChange.bind(this);
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

  addProject(workIndex) {
    const {actions} = this.props;
    return () => {
      actions.addWorkProject(workIndex);
    }
  }

  deleteProject(workIndex) {
    const {actions} = this.props;
    return (projectIndex) => () => {
      actions.deleteWorkProject(workIndex, projectIndex);
    }
  }

  handleProjectChange(workIndex) {
    const {actions} = this.props;
    return (projectIndex) => (workProject) => {
      actions.handleWorkProjectChange(workProject, workIndex, projectIndex);
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
          addProject={this.addProject(index)}
          deleteProject={this.deleteProject(index)}
          handleProjectChange={this.handleProjectChange(index)}
        />
      )
    });
  }

  render() {
    const { actions } = this.props;
    return (
      <div>
        <div>
          {this.renderExperience()}
        </div>
        <div className={styles["resume_button_container"]}>
          <Button
            style="flat"
            value="添加工作经历"
            leftIcon={(
              <i className="fa fa-plus-circle" aria-hidden="true"></i>
            )}
            onClick={actions.addWorkExperience}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { workExperiences } = state.resume;
  return { workExperiences }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkExperiences);

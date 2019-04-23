import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import resumeActions from '../../../redux/actions'
import WorkExperience from './WorkExperience'
import locales from 'LOCALES'
import SectionWrapper from '../shared/SectionWrapper'

const resumeTexts = locales('resume.sections.workExperiences')

class WorkExperiences extends React.Component {
  constructor(props) {
    super(props)
    this.addProject = this.addProject.bind(this)
    this.deleteProject = this.deleteProject.bind(this)
    this.handleProjectChange = this.handleProjectChange.bind(this)
    this.deleteExperience = this.deleteExperience.bind(this)
    this.handleExperienceChange = this.handleExperienceChange.bind(this)
  }

  handleExperienceChange(index) {
    const { actions } = this.props
    return type => (value) => {
      actions.handleWorkExperienceChange({ [type]: value }, index)
    }
  }

  deleteExperience(index) {
    const { actions } = this.props
    return () => {
      actions.deleteWorkExperience(index)
    }
  }

  addProject(workIndex) {
    const { actions } = this.props
    return () => {
      actions.addWorkProject(workIndex)
    }
  }

  deleteProject(workIndex) {
    const { actions } = this.props
    return projectIndex => () => {
      actions.deleteWorkProject(workIndex, projectIndex)
    }
  }

  handleProjectChange(workIndex) {
    const { actions } = this.props
    return projectIndex => (workProject) => {
      actions.handleWorkProjectChange(workProject, workIndex, projectIndex)
    }
  }

  renderExperience() {
    const { workExperiences, disabled } = this.props
    return workExperiences.map((workExperience, index) => (
      <WorkExperience
        key={index}
        index={index}
        disabled={disabled}
        workExperience={workExperience}
        addProject={this.addProject(index)}
        deleteProject={this.deleteProject(index)}
        deleteExperience={this.deleteExperience(index)}
        handleProjectChange={this.handleProjectChange(index)}
        handleExperienceChange={this.handleExperienceChange(index)}
      />
    ))
  }

  render() {
    const { actions } = this.props
    return (
      <SectionWrapper
        editButton
        {...this.props}
        button={resumeTexts.mainButton}
        onClick={actions.addWorkExperience}
      >
        {this.renderExperience()}
      </SectionWrapper>
    )
  }
}

function mapStateToProps(state) {
  const { workExperiences, info } = state.resume
  return {
    workExperiences,
    freshGraduate: info.freshGraduate
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(resumeActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkExperiences)

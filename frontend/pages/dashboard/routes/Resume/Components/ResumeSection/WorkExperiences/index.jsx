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
    this.handleProjectAdded = this.handleProjectAdded.bind(this)
    this.handleProjectRemoved = this.handleProjectRemoved.bind(this)
    this.handleProjectChanged = this.handleProjectChanged.bind(this)
    this.handleExperienceRemoved = this.handleExperienceRemoved.bind(this)
    this.handleExperienceChanged = this.handleExperienceChanged.bind(this)
    this.handleExperienceAdded = this.handleExperienceAdded.bind(this)
  }

  handleExperienceChanged(index) {
    const { actions } = this.props
    return type => (value) => {
      actions.handleWorkExperienceChange({ [type]: value }, index)
    }
  }

  handleExperienceRemoved(index) {
    const { actions } = this.props
    return () => {
      actions.deleteWorkExperience(index)
    }
  }

  handleProjectAdded(workIndex) {
    const { actions } = this.props
    return () => {
      actions.addWorkProject(workIndex)
    }
  }

  handleProjectRemoved(workIndex) {
    const { actions } = this.props
    return projectIndex => () => {
      actions.deleteWorkProject(workIndex, projectIndex)
    }
  }

  handleProjectChanged(workIndex) {
    const { actions } = this.props
    return projectIndex => (workProject) => {
      actions.handleWorkProjectChange(workProject, workIndex, projectIndex)
    }
  }

  handleExperienceAdded(index) {
    const { actions } = this.props
    return () => {
      actions.addWorkExperience(index)
    }
  }

  renderExperience() {
    const { workExperiences, disabled } = this.props
    return workExperiences.map((workExperience, index) => (
      <WorkExperience
        key={index}
        index={index}
        isLast={index === workExperiences.length - 1}
        disabled={disabled}
        workExperience={workExperience}
        handleProjectRemoved={this.handleProjectRemoved(index)}
        handleProjectAdded={this.handleProjectAdded(index)}
        handleProjectChanged={this.handleProjectChanged(index)}
        handleExperienceChanged={this.handleExperienceChanged(index)}
        handleExperienceAdded={this.handleExperienceAdded(index + 1)}
        handleExperienceRemoved={this.handleExperienceRemoved(index)}
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

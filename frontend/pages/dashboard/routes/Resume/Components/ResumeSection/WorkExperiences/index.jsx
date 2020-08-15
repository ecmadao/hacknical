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
    this.handleProjectDetailReorder = this.handleProjectDetailReorder.bind(this)

    this.handleExperienceRemoved = this.handleExperienceRemoved.bind(this)
    this.handleExperienceChanged = this.handleExperienceChanged.bind(this)
    this.handleExperienceAdded = this.handleExperienceAdded.bind(this)
    this.handleExperienceReorder = this.handleExperienceReorder.bind(this)
  }

  handleExperienceChanged(workIndex) {
    const { actions } = this.props
    return type => value =>
      actions.handleWorkExperienceChange({ [type]: value }, workIndex)
  }

  handleExperienceRemoved(workIndex) {
    const { actions } = this.props
    return () => actions.deleteWorkExperience(workIndex)
  }

  handleProjectAdded(workIndex) {
    const { actions } = this.props
    return () => actions.addWorkProject(workIndex)
  }

  handleProjectRemoved(workIndex) {
    const { actions } = this.props
    return projectIndex => () =>
      actions.deleteWorkProject(workIndex, projectIndex)
  }

  handleProjectChanged(workIndex) {
    const { actions } = this.props
    return projectIndex => workProject =>
      actions.handleWorkProjectChange(workProject, workIndex, projectIndex)
  }

  handleExperienceAdded(workIndex) {
    const { actions } = this.props
    return () => actions.addWorkExperience(workIndex)
  }

  handleExperienceReorder(workIndex) {
    const { actions } = this.props
    return order => actions.reorderWorkProjects(workIndex, order)
  }

  handleProjectDetailReorder(workIndex) {
    const { actions } = this.props
    return projectIndex => order =>
      actions.reorderWorkProjectDetails(workIndex, projectIndex, order)
  }

  renderExperience() {
    const { workExperiences, disabled } = this.props
    return workExperiences.map((workExperience, workIndex) => (
      <WorkExperience
        key={`Work.${workIndex}`}
        id={`Work.${workIndex}`}
        isLast={workIndex === workExperiences.length - 1}
        disabled={disabled}
        workExperience={workExperience}
        handleExperienceReorder={this.handleExperienceReorder(workIndex)}
        handleExperienceChanged={this.handleExperienceChanged(workIndex)}
        handleExperienceAdded={this.handleExperienceAdded(workIndex + 1)}
        handleExperienceRemoved={this.handleExperienceRemoved(workIndex)}
        handleProjectRemoved={this.handleProjectRemoved(workIndex)}
        handleProjectAdded={this.handleProjectAdded(workIndex)}
        handleProjectChanged={this.handleProjectChanged(workIndex)}
        handleProjectDetailReorder={this.handleProjectDetailReorder(workIndex)}
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


import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import resumeActions from '../../../redux/actions'
import Education from './Education'
import locales from 'LOCALES'
import SectionWrapper from '../shared/SectionWrapper'

const resumeTexts = locales('resume.sections.educations')

class Educations extends React.Component {
  constructor(props) {
    super(props)
    this.handleEduRemoved = this.handleEduRemoved.bind(this)
    this.handleEduChanged = this.handleEduChanged.bind(this)
    this.handleEduAdded = this.handleEduAdded.bind(this)
  }

  handleEduChanged(eduIndex) {
    const { actions } = this.props
    return type => value =>
      actions.changeEducation({ [type]: value }, eduIndex)
  }

  handleEduRemoved(eduIndex) {
    const { actions } = this.props
    return () => actions.deleteEducation(eduIndex)
  }

  handleEduAdded(eduIndex) {
    const { actions } = this.props
    return () => actions.addEducation(eduIndex)
  }

  renderEdu() {
    const { educations, disabled, freshGraduate } = this.props
    return educations.map((edu, eduIndex) => (
      <Education
        edu={edu}
        key={`Education.${eduIndex}`}
        id={`Education.${eduIndex}`}
        disabled={disabled}
        freshGraduate={freshGraduate}
        isLast={eduIndex === educations.length - 1}
        handleEduRemoved={this.handleEduRemoved(eduIndex)}
        handleEduChanged={this.handleEduChanged(eduIndex)}
        handleEduAdded={this.handleEduAdded(eduIndex + 1)}
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
        onClick={actions.addEducation}
      >
        {this.renderEdu()}
      </SectionWrapper>
    )
  }
}

function mapStateToProps(state) {
  const { educations, info } = state.resume
  return {
    educations,
    freshGraduate: info.freshGraduate
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(resumeActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Educations)

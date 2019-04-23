
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
    this.handleDelete = this.handleDelete.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(index) {
    const { actions } = this.props
    return type => (value) => {
      actions.changeEducation({ [type]: value }, index)
    }
  }

  handleDelete(index) {
    const { actions } = this.props
    return () => actions.deleteEducation(index)
  }

  renderEdu() {
    const { educations, disabled, freshGraduate } = this.props
    return educations.map((edu, index) => (
      <Education
        edu={edu}
        key={index}
        index={index}
        disabled={disabled}
        freshGraduate={freshGraduate}
        handleDelete={this.handleDelete(index)}
        handleChange={this.handleChange(index)}
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

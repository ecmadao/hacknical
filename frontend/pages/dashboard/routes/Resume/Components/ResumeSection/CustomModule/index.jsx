
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import resumeActions from '../../../redux/actions'
import locales from 'LOCALES'
import DragAndDrop from 'COMPONENTS/DragAndDrop'
import SectionWrapper from '../shared/SectionWrapper'
import Section from './Section'

const resumeTexts = locales('resume.sections.custom')

class CustomModule extends React.Component {
  constructor(props) {
    super(props)

    this.reorderSection = this.reorderSection.bind(this)
    this.deleteSection = this.deleteSection.bind(this)
    this.handleSectionChange = this.handleSectionChange.bind(this)
  }

  handleSectionChange(sectionIndex) {
    const { actions, moduleIndex } = this.props
    return type => value =>
      actions.changeModuleSection({ [type]: value }, moduleIndex, sectionIndex)
  }

  deleteSection(sectionIndex) {
    const { actions, moduleIndex } = this.props
    return () => actions.deleteModuleSection(moduleIndex, sectionIndex)
  }

  reorderSection(order) {
    const fromIndex = order.source.index
    const toIndex = order.destination.index
    if (toIndex === fromIndex) return

    const { actions, module, moduleIndex } = this.props
    const newSections = [...module.sections]

    const [section] = newSections.splice(fromIndex, 1)
    newSections.splice(toIndex, 0, section)

    actions.updateModuleSections(newSections, moduleIndex)
  }

  renderModules() {
    const { module, disabled, moduleIndex } = this.props
    if (!module) return null
    const { sections = [] } = module

    return (
      <DragAndDrop onDragEnd={this.reorderSection}>
        {sections.map((section, sectionIndex) => ({
          id: `CustomModule.${moduleIndex}.Section.${sectionIndex}`,
          Component: (
            <Section
              key={`CustomModule.${moduleIndex}.Section.${sectionIndex}`}
              id={`CustomModule.${moduleIndex}.Section.${sectionIndex}`}
              section={section}
              disabled={disabled}
              handleDelete={this.deleteSection(sectionIndex)}
              handleChange={this.handleSectionChange(sectionIndex)}
            />
          )
        }))}
      </DragAndDrop>
    )
  }

  render() {
    const { actions, sectionId, moduleIndex, module } = this.props
    if (!module) return null
    const title = module.text || module.title || this.props.title || ''
    return (
      <SectionWrapper
        editable
        deletable
        editButton
        {...this.props}
        title={title}
        button={resumeTexts.mainButton}
        onTitleChange={(pre, next) => actions.changeModuleTitle(moduleIndex, next)}
        onClick={() => actions.addModuleSection(moduleIndex)}
        onDelete={() => actions.removeCustomModule(sectionId || module.id)}
      >
        {this.renderModules()}
      </SectionWrapper>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { customModules = [], activeSection } = state.resume
  const targetId = (ownProps && (ownProps.sectionId || ownProps.section)) || activeSection
  const moduleIndex = customModules.findIndex(module => module.id === targetId)
  return {
    moduleIndex,
    module: customModules[moduleIndex] || null
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(resumeActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomModule)

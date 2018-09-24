
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import resumeActions from '../../../redux/actions';
import locales from 'LOCALES';
import SectionWrapper from '../shared/SectionWrapper';
import Section from './Section';

const resumeTexts = locales('resume.sections.custom');

class CustomModule extends React.Component {
  constructor(props) {
    super(props);
    this.deleteSection = this.deleteSection.bind(this);
    this.handleSectionChange = this.handleSectionChange.bind(this);
  }

  handleSectionChange(sectionIndex) {
    const { actions, moduleIndex } = this.props;
    return type => (value) => {
      actions.changeModuleSection({ [type]: value }, moduleIndex, sectionIndex);
    };
  }

  deleteSection(sectionIndex) {
    const { actions, moduleIndex } = this.props;
    return () => actions.deleteModuleSection(moduleIndex, sectionIndex);
  }

  renderModule() {
    const { module, disabled } = this.props;
    const { sections } = module;
    return sections.map((section, index) => (
      <Section
        key={index}
        index={index}
        section={section}
        disabled={disabled}
        handleDelete={this.deleteSection(index)}
        handleChange={this.handleSectionChange(index)}
      />
    ));
  }

  render() {
    const { actions, moduleIndex } = this.props;
    return (
      <SectionWrapper
        editButton
        titleEditable
        {...this.props}
        button={resumeTexts.mainButton}
        onTitleChange={actions.changeModuleTitle}
        onClick={() => actions.addModuleSection(moduleIndex)}
      >
        {this.renderModule()}
      </SectionWrapper>
    );
  }
}

function mapStateToProps(state) {
  const { customModules, activeSection } = state.resume;
  const moduleIndex = customModules.findIndex(module => module.id === activeSection);
  return {
    moduleIndex,
    module: customModules[moduleIndex]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(resumeActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomModule);

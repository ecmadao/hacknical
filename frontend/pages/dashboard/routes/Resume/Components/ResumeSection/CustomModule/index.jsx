
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import resumeActions from '../../../redux/actions';
import locales from 'LOCALES';
import SectionWrapper from '../shared/SectionWrapper';

const resumeTexts = locales('resume.sections.custom');

class CustomModule extends React.Component {
  constructor(props) {
    super(props);
    // this.deleteEdu = this.deleteEdu.bind(this);
    // this.handleEduChange = this.handleEduChange.bind(this);
  }

  renderModule() {
    const { module } = this.props;
    const { sections } = module;
    return null;
  }

  render() {
    const { actions, index } = this.props;
    return (
      <SectionWrapper
        editButton
        {...this.props}
        button={resumeTexts.mainButton}
        onClick={() => actions.addModuleSection(index)}
      >
        {this.renderModule()}
      </SectionWrapper>
    );
  }
}

function mapStateToProps(state) {
  const { customModules, activeSection } = state.resume;
  const index = customModules.findIndex(module => module.id === activeSection);
  console.log(`customModule index: ${index}`)
  return {
    index,
    module: customModules[index]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(resumeActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomModule);

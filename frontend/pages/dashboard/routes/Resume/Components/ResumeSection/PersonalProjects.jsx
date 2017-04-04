import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { bindActionCreators } from 'redux';
import { InputGroup, Textarea } from 'light-ui';

import Labels from 'COMPONENTS/Labels';
import styles from '../../styles/resume.css';
import actions from '../../redux/actions';
import locales from 'LOCALES';
import { TipsoInput, SectionWrapper } from './components';

const resumeTexts = locales("resume").sections.projects;

class PersonalProjects extends React.Component {
  constructor(props) {
    super(props);
    this.addTech = this.addTech.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.deleteTech = this.deleteTech.bind(this);
    this.handleProjectChange = this.handleProjectChange.bind(this);
  }

  deleteProject(index) {
    return () => {
      this.props.actions.deletePersonalProject(index);
    }
  }

  renderProjects() {
    const { personalProjects } = this.props;
    return personalProjects.map((personalProject, index) => {
      const { url, desc, techs, title } = personalProject;
      return (
        <div className={styles["resume_piece_container"]} key={index}>
          <div className={cx(styles["resume_wrapper"], styles["with_margin"])}>
            <div className={styles["resume_delete"]} onClick={this.deleteProject(index)}>
              <i className="fa fa-trash-o" aria-hidden="true"></i>
            </div>
            <InputGroup
              value={title}
              theme="flat"
              placeholder={resumeTexts.projectName}
              tipsoStyle={{
                left: '0',
                transform: 'translateX(0)'
              }}
              wrapperClassName={cx(styles["input_group"], styles["single_input"])}
              onChange={this.handleProjectChange(index)('title')}>
              <TipsoInput
                value={url}
                placeholder={resumeTexts.homepage}
                className={styles['tipso_input_long']}
                onChange={this.handleProjectChange(index)('url')}
              />
            </InputGroup>
          </div>
          <div className={styles["resume_wrapper"]}>
            <Textarea
              max="200"
              value={desc}
              placeholder={resumeTexts.projectDesc}
              type="textarea"
              onChange={this.handleProjectChange(index)('desc')}
            />
          </div>
          <div className={styles["resume_wrapper"]}>
            <Labels
              labels={techs}
              onAdd={this.addTech(index)}
              onDelete={this.deleteTech(index)}
              max={5}
              placeholder={`+ ${resumeTexts.technologies}`}
            />
          </div>
        </div>
      )
    });
  }

  addTech(index) {
    return (tech) => {
      this.props.actions.addProjectTech(tech, index);
    }
  }

  deleteTech(projectIndex) {
    return (techIndex) => {
      this.props.actions.deleteProjectTech(projectIndex, techIndex)
    }
  }

  handleProjectChange(index) {
    const { actions } = this.props;
    return (type) => (value) => {
      actions.handlePersonalProjectChange({[type]: value}, index);
    }
  }

  render() {
    const { actions } = this.props;
    return (
      <SectionWrapper
        title={resumeTexts.title}
        button={resumeTexts.mainButton}
        onClick={actions.addPersonalProject}>
        {this.renderProjects()}
      </SectionWrapper>
    )
  }
}

function mapStateToProps(state) {
  const { personalProjects } = state.resume;
  return { personalProjects }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalProjects);

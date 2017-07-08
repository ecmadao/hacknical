import React from 'react';
import { InputGroup, Input } from 'light-ui';
import DateSlider from 'COMPONENTS/DateSlider';
import { EDUCATIONS } from 'SHARED/datas/resume';
import WorkProject from './WorkProject';
import { TipsoInput } from '../components';
import styles from '../../../styles/resume.css';
import locales from 'LOCALES';

const resumeTexts = locales("resume").sections.work;

class WorkExperience extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startOpen: false,
      endOpen: false
    };
    this.handleStartFocus = this.handleStartFocus.bind(this);
    this.handleEndFocus = this.handleEndFocus.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
  }

  handleStartFocus({ focused: startOpen }) {
    this.setState({ startOpen });
  }

  handleEndFocus({ focused: endOpen }) {
    this.setState({ endOpen });
  }

  handleEndTimeChange(endTime, untilNow = false) {
    const { handleExperienceChange } = this.props;
    handleExperienceChange('endTime')(endTime);
    if (untilNow) {
      handleExperienceChange('untilNow')(true);
    }
  }

  renderWorkProjects(projects) {
    const { handleProjectChange, deleteProject, disabled } = this.props;
    return projects.map((project, index) => (
      <WorkProject
        key={index}
        project={project}
        disabled={disabled}
        onDelete={deleteProject(index)}
        onChange={handleProjectChange(index)}
      />
    ));
  }

  render() {
    const { startOpen, endOpen } = this.state;
    const {
      index,
      disabled,
      addProject,
      workExperience,
      deleteExperience,
      handleExperienceChange,
    } = this.props;
    const {
      url,
      company,
      position,
      startTime,
      endTime,
      projects,
      untilNow,
    } = workExperience;

    return (
      <div className={styles["resume_piece_container"]}>
        <div className={styles["section_second_title"]}>
          {resumeTexts.companyInfo}
        </div>
        <div className={styles["resume_wrapper"]}>
          <InputGroup
            value={company}
            theme="flat"
            disabled={disabled}
            placeholder={resumeTexts.companyName}
            onChange={handleExperienceChange('company')}>
            <TipsoInput
              value={url}
              placeholder={resumeTexts.homepage}
              onChange={handleExperienceChange('url')}
              className={styles['tipso_input_long']}
            />
          </InputGroup>
          <Input
            value={position}
            theme="flat"
            disabled={disabled}
            placeholder={resumeTexts.position}
            className={styles["last_input"]}
            onChange={handleExperienceChange('position')}
          />
          <div className={styles["resume_delete"]} onClick={deleteExperience}>
            <i className="fa fa-trash-o" aria-hidden="true"></i>
          </div>
        </div>
        <div className={styles["resume_wrapper"]}>
          <DateSlider
            initialStart={startTime}
            initialEnd={untilNow ? null : endTime}
            startText={resumeTexts.entriedAt}
            endText={resumeTexts.dimissionAt}
            onStartChange={handleExperienceChange('startTime')}
            onEndChange={this.handleEndTimeChange}
          />
        </div>
        <div className={styles["project_wrapper"]}>
          <div className={styles["section_second_title"]}>
            {resumeTexts.joinedProjects}
          </div>
          {this.renderWorkProjects(projects)}
          <div
            className={styles["resume_add"]}
            onClick={addProject}>
            <i className="fa fa-plus-circle" aria-hidden="true"></i>
            &nbsp;&nbsp;&nbsp;
            {resumeTexts.sideButton}
          </div>
        </div>
      </div>
    )
  }
}

export default WorkExperience;

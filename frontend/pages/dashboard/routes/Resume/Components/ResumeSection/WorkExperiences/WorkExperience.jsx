import React from 'react';
import { InputGroup, Input } from 'light-ui';

import DateSlider from 'COMPONENTS/DateSlider';
import { EDUCATIONS } from 'SHARED/datas/resume';
import WorkProject from './WorkProject';
import { TipsoInput } from '../components';
import styles from '../../../styles/resume.css';
import dateHelper from 'UTILS/date';
import locales from 'LOCALES';

const resumeTexts = locales("resume").sections.work;
const getSecondsByDate = dateHelper.seconds.getByDate;
const getDateNow = dateHelper.date.now;
const DATE_NOW = getDateNow();

class WorkExperience extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startOpen: false,
      endOpen: false
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.handleStartFocus = this.handleStartFocus.bind(this);
    this.handleEndFocus = this.handleEndFocus.bind(this);
  }

  handleStartFocus({ focused: startOpen }) {
    this.setState({ startOpen });
  }

  handleEndFocus({ focused: endOpen }) {
    this.setState({ endOpen });
  }

  onDateChange(type) {
    const {handleExperienceChange} = this.props;
    return (momentTime) => {
      const time = momentTime.format('L');
      handleExperienceChange && handleExperienceChange(type)(time);
    }
  }

  renderWorkProjects(projects) {
    const { handleProjectChange, deleteProject } = this.props;
    return projects.map((project, index) => {
      return (
        <WorkProject
          key={index}
          project={project}
          onDelete={deleteProject(index)}
          onChange={handleProjectChange(index)}
        />
      )
    })
  }

  render() {
    const {startOpen, endOpen} = this.state;
    const {
      index,
      workExperience,
      deleteExperience,
      handleExperienceChange,
      addProject
    } = this.props;
    const {
      url,
      company,
      position,
      startTime,
      endTime,
      projects
    } = workExperience;

    const endText = getSecondsByDate(endTime) >= getSecondsByDate(DATE_NOW) ? resumeTexts.untilNow : resumeTexts.dimissionAt;

    return (
      <div className={styles["resume_piece_container"]}>
        <div className={styles["section_second_title"]}>
          {resumeTexts.companyInfo}
        </div>
        <div className={styles["resume_wrapper"]}>
          <InputGroup
            value={company}
            theme="flat"
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
            initialEnd={endTime}
            startText={resumeTexts.entriedAt}
            endText={endText}
            onStartChange={handleExperienceChange('startTime')}
            onEndChange={handleExperienceChange('endTime')}
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

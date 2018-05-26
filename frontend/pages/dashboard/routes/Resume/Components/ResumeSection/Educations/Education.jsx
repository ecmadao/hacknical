import React from 'react';
import { Input, SelectorV2 } from 'light-ui';
import WritableList from 'COMPONENTS/WritableList';
import DateSlider from 'COMPONENTS/DateSlider'
import dateHelper from 'UTILS/date';
import { EDUCATIONS } from 'SHARED/datas/resume';
import styles from '../../../styles/resume.css';
import locales from 'LOCALES';

const resumeTexts = locales('resume').sections.educations;

class Education extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entranceOpen: false,
      graduationOpen: false
    };
    this.addExperience = this.addExperience.bind(this);
    this.deleteExperience = this.deleteExperience.bind(this);
    this.changeExperience = this.changeExperience.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.handleEntranceFocus = this.handleEntranceFocus.bind(this);
    this.handleGraduationFocus = this.handleGraduationFocus.bind(this);
  }

  handleEntranceFocus({ focused: entranceOpen }) {
    this.setState({ entranceOpen });
  }

  handleGraduationFocus({ focused: graduationOpen }) {
    this.setState({ graduationOpen });
  }

  onDateChange(type) {
    const { handleEduChange } = this.props;
    return (momentTime) => {
      const time = momentTime.format('L');
      handleEduChange && handleEduChange(type)(time);
    };
  }

  addExperience(experience) {
    const { edu, handleEduChange } = this.props;
    const { experiences = [] } = edu;
    handleEduChange('experiences')([...experiences, experience]);
  }

  deleteExperience(index) {
    const { edu, handleEduChange } = this.props;
    const { experiences } = edu;
    handleEduChange('experiences')(
      [...experiences.slice(0, index), ...experiences.slice(index + 1)]
    );
  }

  changeExperience(experience, index) {
    const { edu, handleEduChange } = this.props;
    const { experiences } = edu;
    handleEduChange('experiences')(
      [
        ...experiences.slice(0, index),
        experience,
        ...experiences.slice(index + 1)
      ]
    );
  }

  render() {
    const {
      edu,
      disabled,
      deleteEdu,
      freshGraduate,
      handleEduChange,
    } = this.props;
    const {
      major,
      school,
      endTime,
      education,
      startTime,
      experiences = []
    } = edu;

    return (
      <div className={styles.resume_piece_container}>
        <div className={styles.resume_wrapper}>
          <div className={styles.resume_delete} onClick={deleteEdu}>
            <i className="fa fa-trash-o" aria-hidden="true" />
          </div>
          <Input
            theme="flat"
            value={school}
            disabled={disabled}
            placeholder={resumeTexts.school}
            className={styles.single_input}
            onChange={handleEduChange('school')}
          />
        </div>
        <div className={styles.resume_wrapper}>
          <Input
            theme="flat"
            value={major}
            disabled={disabled}
            placeholder={resumeTexts.major}
            onChange={handleEduChange('major')}
          />
          <SelectorV2
            theme="flat"
            value={education}
            disabled={disabled}
            options={EDUCATIONS}
            onChange={handleEduChange('education')}
          />
        </div>
        <div className={styles.resume_wrapper}>
          <DateSlider
            pushInterval="year"
            initialEnd={endTime}
            initialStart={startTime}
            endText={resumeTexts.graduateAt}
            startText={resumeTexts.entranceAt}
            maxDate={dateHelper.date.afterYears(5)}
            onStartChange={handleEduChange('startTime')}
            onEndChange={handleEduChange('endTime')}
          />
        </div>
        {freshGraduate ? (
          <div className={styles.resume_wrapper}>
            <WritableList
              items={experiences}
              onAdd={this.addExperience}
              onDelete={this.deleteExperience}
              onChange={this.changeExperience}
              introText={resumeTexts.introText}
              placeholder={resumeTexts.addEduExperience}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default Education;

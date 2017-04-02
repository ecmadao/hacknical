import React from 'react';
import { Input, SelectorV2 } from 'light-ui';

import DateSlider from 'COMPONENTS/DateSlider'
import dateHelper from 'UTILS/date';
import { EDUCATIONS } from 'SHARED/datas/resume';
import styles from '../../../styles/resume.css';
import locales from 'LOCALES';

const resumeTexts = locales("resume").sections.edu;

class Education extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entranceOpen: false,
      graduationOpen: false
    };
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
    const {handleEduChange} = this.props;
    return (momentTime) => {
      const time = momentTime.format('L');
      handleEduChange && handleEduChange(type)(time);
    }
  }

  render() {
    const {edu, handleEduChange, deleteEdu, index} = this.props;
    const {entranceOpen, graduationOpen} = this.state;
    const {
      school,
      major,
      education,
      startTime,
      endTime,
    } = edu;

    return (
      <div className={styles["resume_piece_container"]}>
        <div className={styles["resume_wrapper"]}>
          <div className={styles["resume_delete"]} onClick={deleteEdu}>
            <i className="fa fa-trash-o" aria-hidden="true"></i>
          </div>
          <Input
            value={school}
            theme="flat"
            placeholder={resumeTexts.school}
            className={styles["single_input"]}
            onChange={handleEduChange('school')}
          />
        </div>
        <div className={styles["resume_wrapper"]}>
          <Input
            value={major}
            theme="flat"
            placeholder={resumeTexts.major}
            onChange={handleEduChange('major')}
          />
          <SelectorV2
            value={education}
            options={EDUCATIONS}
            theme="flat"
            onChange={handleEduChange('education')}
          />
        </div>
        <div className={styles["resume_wrapper"]}>
          <DateSlider
            initialStart={startTime}
            initialEnd={endTime}
            startText={resumeTexts.entranceAt}
            endText={resumeTexts.graduateAt}
            maxDate={dateHelper.date.afterYears(5)}
            pushInterval="year"
            onStartChange={handleEduChange('startTime')}
            onEndChange={handleEduChange('endTime')}
          />
        </div>
      </div>
    )
  }
}

export default Education;

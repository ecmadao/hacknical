import React, { PropTypes } from 'react';

import DateSlider from 'COMPONENTS/DateSlider'
import Input from 'COMPONENTS/Input';
import SelectorV2 from 'COMPONENTS/SelectorV2';
import dateHelper from 'UTILS/date';
import { EDUCATIONS } from 'SHAREDPAGE/datas/resume';
import styles from '../../../styles/resume.css';

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
            style="flat"
            placeholder="学校名称"
            customStyle={styles["single_input"]}
            onChange={handleEduChange('school')}
          />
        </div>
        <div className={styles["resume_wrapper"]}>
          <Input
            value={major}
            style="flat"
            placeholder="院系 & 专业"
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
            startText="入学时间"
            endText="毕业时间"
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

import React, { PropTypes } from 'react';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/css/styles.scss';
import moment from 'moment';

import Input from 'COMPONENTS/Input';
import Selector from 'COMPONENTS/Selector';
import { EDUCATIONS } from '../../../helper/const_value';
import WorkProjects from './WorkProjects';
moment.locale('zh-cn');

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

  render() {
    const {startOpen, endOpen} = this.state;
    const {
      index,
      workExperience,
      deleteExperience,
      handleExperienceChange
    } = this.props;
    const {
      company,
      position,
      startTime,
      endTime,
      projects
    } = workExperience;

    return (
      <div className="resume_piece_container">
        <div className="resume_delete" onClick={deleteExperience}>
          <i className="fa fa-trash-o" aria-hidden="true"></i>
        </div>
        <div className="resume_title">
          公司信息
        </div>
        <div className="resume_wrapper">
          <Input
            value={company}
            placeholder="公司名称"
            onChange={handleExperienceChange('company')}
          />
          <Input
            value={position}
            placeholder="所处职位"
            onChange={handleExperienceChange('position')}
          />
        </div>
        <div className="resume_wrapper">
          <SingleDatePicker
            numberOfMonths={1}
            id={`start_input_${index}`}
            date={startTime ? moment(startTime) : null}
            focused={startOpen}
            placeholder="入职时间"
            monthFormat="YYYY[年]MMMM"
            onDateChange={this.onDateChange('startTime')}
            onFocusChange={this.handleStartFocus}
          />
          <SingleDatePicker
            numberOfMonths={1}
            id={`end_input_${index}`}
            date={endTime ? moment(endTime) : null}
            focused={endOpen}
            placeholder="离职时间"
            monthFormat="YYYY[年]MMMM"
            onDateChange={this.onDateChange('endTime')}
            onFocusChange={this.handleEndFocus}
          />
        </div>
        <WorkProjects
          projects={projects}
        />
      </div>
    )
  }
}

export default WorkExperience;

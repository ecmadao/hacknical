import React, { PropTypes } from 'react';

import FormatInput from 'COMPONENTS/FormatInput';
import Input from 'COMPONENTS/Input';
import { EDUCATIONS } from '../../../helper/const_value';
import WorkProject from './WorkProject';

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
            style="flat"
            placeholder="公司名称"
            onChange={handleExperienceChange('company')}
          />
          <Input
            value={position}
            style="flat"
            placeholder="所处职位"
            onChange={handleExperienceChange('position')}
          />
        </div>
        <div className="resume_wrapper">
          <FormatInput
            value={startTime}
            style="flat"
            formatType="date"
            placeholder="入职时间 (YYYY/MM/DD)"
            className={`input-startTime-${index}`}
            onChange={handleExperienceChange('startTime')}
          />
          <FormatInput
            value={endTime}
            style="flat"
            formatType="date"
            placeholder="离职时间 (YYYY/MM/DD)"
            className={`input-endTime-${index}`}
            onChange={handleExperienceChange('endTime')}
          />
        </div>
        <div className="project_wrapper">
          <div className="resume_title">
            参与项目
          </div>
          {this.renderWorkProjects(projects)}
          <div
            className="resume_add"
            onClick={addProject}>
            <i className="fa fa-plus-circle" aria-hidden="true"></i>
            &nbsp;&nbsp;&nbsp;
            添加参与的项目
          </div>
        </div>
      </div>
    )
  }
}

export default WorkExperience;

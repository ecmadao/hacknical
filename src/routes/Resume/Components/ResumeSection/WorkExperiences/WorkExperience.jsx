import React, { PropTypes } from 'react';
import Cleave from 'cleave.js';

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

  componentDidMount() {
    new Cleave('.input-startTime', {
      date: true,
      datePattern: ['Y', 'm', 'd']
    });
    new Cleave('.input-endTime', {
      date: true,
      datePattern: ['Y', 'm', 'd']
    });
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
          <Input
            value={startTime}
            style="flat"
            placeholder="入职时间 (YYYY/MM/DD)"
            className="input-startTime"
            onChange={handleExperienceChange('startTime')}
          />
          <Input
            value={endTime}
            style="flat"
            placeholder="离职时间 (YYYY/MM/DD)"
            className="input-endTime"
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

import React, { PropTypes } from 'react';

import DateSlider from 'COMPONENTS/DateSlider';
import Input from 'COMPONENTS/Input';
import InputsGroup from 'COMPONENTS/InputsGroup';
import { EDUCATIONS } from 'SHAREDPAGE/datas/resume';
import WorkProject from './WorkProject';
import styles from '../../../styles/resume.css';
import dateHelper from 'UTILS/date';

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

    const endText = dateHelper.seconds.getByDate(endTime) > dateHelper.seconds.getCurrent() ? '预计离职时间' : '离职时间';

    return (
      <div className={styles["resume_piece_container"]}>
        <div className={styles["resume_delete"]} onClick={deleteExperience}>
          <i className="fa fa-trash-o" aria-hidden="true"></i>
        </div>
        <div className={styles["resume_title"]}>
          公司信息
        </div>
        <div className={styles["resume_wrapper"]}>
          <InputsGroup
            value={company}
            style="flat"
            placeholder="公司名称"
            onChange={handleExperienceChange('company')}>
            <div className={styles["project_link_wrapper"]}>
              <i className="fa fa-link" aria-hidden="true"></i>
              &nbsp;&nbsp;
              <Input
                value={url}
                type="url"
                check={false}
                style="borderless"
                className="underline"
                placeholder="填写公司主页"
                onChange={handleExperienceChange('url')}
              />
            </div>
          </InputsGroup>
          <Input
            value={position}
            style="flat"
            placeholder="所处职位"
            onChange={handleExperienceChange('position')}
          />
        </div>
        <div className={styles["resume_wrapper"]}>
          <DateSlider
            initialStart={startTime}
            initialEnd={endTime}
            startText="入职时间"
            endText={endText}
            maxDate={dateHelper.date.afterYears(1)}
            onStartChange={handleExperienceChange('startTime')}
            onEndChange={handleExperienceChange('endTime')}
          />
        </div>
        <div className={styles["project_wrapper"]}>
          <div className={styles["resume_title"]}>
            参与项目
          </div>
          {this.renderWorkProjects(projects)}
          <div
            className={styles["resume_add"]}
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

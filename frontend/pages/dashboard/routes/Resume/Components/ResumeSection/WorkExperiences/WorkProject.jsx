import React, { PropTypes } from 'react';
import WritableList from 'COMPONENTS/WritableList';
import Input from 'COMPONENTS/Input';
import styles from '../../../styles/resume.css';

class WorkProject extends React.Component {
  constructor(props) {
    super(props);
    this.addDetail = this.addDetail.bind(this);
    this.deleteDetail = this.deleteDetail.bind(this);
    this.changeDetail = this.changeDetail.bind(this);
    this.handleProjectChange = this.handleProjectChange.bind(this);
  }

  addDetail(detail) {
    const { project, onChange } = this.props;
    onChange && onChange({
      details: [...project.details, detail]
    });
  }

  deleteDetail(index) {
    const { project, onChange } = this.props;
    const { details } = project;
    onChange && onChange({
      details: [...details.slice(0, index), ...details.slice(index + 1)]
    });
  }

  changeDetail(detail, index) {
    const { project, onChange } = this.props;
    const { details } = project;
    onChange && onChange({
      details: [...details.slice(0, index), detail, ...details.slice(index + 1)]
    });
  }

  handleProjectChange(type) {
    const { onChange } = this.props;
    return (value) => {
      onChange && onChange({[type]: value})
    }
  }

  render() {
    const { project, onChange, onDelete } = this.props;
    return (
      <div className={styles["project_container"]}>
        <div className={styles["project_name_wrapper"]}>
          <Input
            value={project.name}
            placeholder="项目名称"
            style="flat"
            onChange={this.handleProjectChange('name')}
          />
          <div className={styles["project_delete"]} onClick={onDelete}>
            <i className="fa fa-trash-o" aria-hidden="true"></i>
          </div>
        </div>
        <WritableList
          placeholder="项目描述"
          items={project.details}
          onAdd={this.addDetail}
          onDelete={this.deleteDetail}
          onChange={this.changeDetail}
        />
      </div>
    )
  }
}

export default WorkProject

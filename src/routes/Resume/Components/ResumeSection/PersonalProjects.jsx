import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

import Textarea from 'COMPONENTS/Textarea';
import Button from 'COMPONENTS/Button';
import Input from 'COMPONENTS/Input';
import Labels from 'COMPONENTS/Labels';

import actions from '../../redux/actions';

class PersonalProjects extends React.Component {
  constructor(props) {
    super(props);
    this.addTech = this.addTech.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.deleteTech = this.deleteTech.bind(this);
    this.handleProjectChange = this.handleProjectChange.bind(this);
  }

  deleteProject(index) {
    return () => {
      this.props.actions.deletePersonalProject(index);
    }
  }

  renderProjects() {
    const { personalProjects } = this.props;
    return personalProjects.map((personalProject, index) => {
      const { url, desc, techs } = personalProject;
      return (
        <div className="resume_piece_container large" key={index}>
          <div className="resume_delete" onClick={this.deleteProject(index)}>
            <i className="fa fa-trash-o" aria-hidden="true"></i>
          </div>
          <div className="resume_wrapper with_margin">
            <i className="fa fa-link" aria-hidden="true"></i>
            &nbsp;&nbsp;
            <Input
              value={url}
              type="url"
              style="borderless underline"
              placeholder="填写项目链接"
              onChange={this.handleProjectChange(index)('url')}
            />
          </div>
          <div className="resume_wrapper">
            <Textarea
              value={desc}
              placeholder="填写项目描述"
              onChange={this.handleProjectChange(index)('desc')}
            />
          </div>
          <div className="resume_wrapper">
            <Labels
              labels={techs}
              onAdd={this.addTech(index)}
              onDelete={this.deleteTech(index)}
              placeholder="+ 添加使用的技术"
            />
          </div>
        </div>
      )
    });
  }

  addTech(index) {
    return (tech) => {
      this.props.actions.addProjectTech(tech, index);
    }
  }

  deleteTech(projectIndex) {
    return (techIndex) => {
      this.props.actions.deleteProjectTech(projectIndex, techIndex)
    }
  }

  handleProjectChange(index) {
    const { actions } = this.props;
    return (type) => (value) => {
      actions.handlePersonalProjectChange({[type]: value}, index);
    }
  }

  render() {
    const { actions } = this.props;
    return (
      <div>
        <div className="resume_title single_title">
          个人项目
        </div>
        <div>
          {this.renderProjects()}
        </div>
        <div className="resume_button_container">
          <Button
            style="flat"
            value="添加个人项目"
            leftIcon={(
              <i className="fa fa-plus-circle" aria-hidden="true"></i>
            )}
            onClick={actions.addPersonalProject}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { personalProjects } = state.resume;
  return { personalProjects }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalProjects);

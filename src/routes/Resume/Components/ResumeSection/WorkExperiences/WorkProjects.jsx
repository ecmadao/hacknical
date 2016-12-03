import React, { PropTypes } from 'react';

class WorkProjects extends React.Component {

  renderProjectDetail(details) {
  }

  renderProjects() {
    const {projects} = this.props;
    return projects.map((project, index) => {
      return (
        <div>

        </div>
      )
    });
  }

  render() {
    return (
      <div className="project_wrapper">
        <div className="resume_title">
          参与项目
        </div>
        {this.renderProjects()}
      </div>
    )
  }
}

export default WorkProjects

import React, { PropTypes } from 'react';
import WritableList from 'COMPONENTS/WritableList';

class WorkProject extends React.Component {

  handleDetailChange(index) {

  }

  addDetail(projectIndex) {
    return (value) => {

    }
  }

  deleteDetail() {

  }

  render() {
    const { project } = this.props;
    return (
      <div>
        {project.name}
        <WritableList
          items={project.details}
        />
      </div>
    )
  }
}

export default WorkProject

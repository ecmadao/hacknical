import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

import actions from '../../../redux/actions';
import Education from './Education';

class Educations extends React.Component {
  constructor(props) {
    super(props);
    this.deleteEdu = this.deleteEdu.bind(this);
    this.handleEduChange = this.handleEduChange.bind(this);
  }

  handleEduChange(index) {
    const {actions} = this.props;
    return (type) => (value) => {
      actions.handleEduChange({[type]: value}, index);
    }
  }

  deleteEdu(index) {
    const {actions} = this.props;
    return () => {
      actions.deleteEducation(index);
    }
  }

  renderEdu() {
    const {educations} = this.props;
    return educations.map((edu, index) => {
      return (
        <Education
          key={index}
          edu={edu}
          index={index}
          deleteEdu={this.deleteEdu(index)}
          handleEduChange={this.handleEduChange(index)}
        />
      )
    });
  }

  render() {
    const {actions} = this.props;
    return (
      <div>
        <div>
          {this.renderEdu()}
        </div>
        <div
          className="resume_add_button"
          onClick={actions.addEducation}>
          <i className="fa fa-plus-circle" aria-hidden="true"></i>
          &nbsp;&nbsp;&nbsp;
          添加教育经历
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {educations} = state.resume;
  return { educations }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Educations);

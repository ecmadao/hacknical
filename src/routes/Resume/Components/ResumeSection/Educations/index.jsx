import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

import actions from '../../../redux/actions';
import Education from './Education';

class Educations extends React.Component {
  constructor(props) {
    super(props);
    this.handleEduChange = this.handleEduChange.bind(this);
  }

  handleEduChange(index) {
    const {actions} = this.props;
    return (type) => (value) => {
      actions.handleEduChange({[type]: value}, index);
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
          handleEduChange={this.handleEduChange(index)}
        />
      )
    });
  }

  render() {
    return (
      <div>
        {this.renderEdu()}
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

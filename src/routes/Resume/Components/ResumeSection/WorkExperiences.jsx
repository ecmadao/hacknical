import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import actions from '../../redux/actions';

class WorkExperiences extends React.Component {
  render() {
    return (
      <div>
        WorkExperiences
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {workExperiences} = state.resume;
  return {...workExperiences}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkExperiences);

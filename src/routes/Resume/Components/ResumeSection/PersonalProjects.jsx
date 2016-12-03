import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import actions from '../../redux/actions';

class PersonalProjects extends React.Component {
  render() {
    return (
      <div>
        PersonalProjects
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {personalProjects} = state.resume;
  return {...personalProjects}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalProjects);

import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import actions from '../../redux/actions';

class Educations extends React.Component {
  render() {
    return (
      <div>
        Educations
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {educations} = state.resume;
  return {...educations}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Educations);

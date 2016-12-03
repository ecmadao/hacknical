import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import actions from '../../redux/actions';

class Info extends React.Component {
  render() {
    return (
      <div>
        Info
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {info} = state.resume;
  return {...info}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);

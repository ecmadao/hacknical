import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import actions from '../../redux/actions';

class Others extends React.Component {
  render() {
    return (
      <div>
        Others
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {others} = state.resume;
  return {...others}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Others);

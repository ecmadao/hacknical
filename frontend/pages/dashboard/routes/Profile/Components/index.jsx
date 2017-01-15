import React from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import { bindActionCreators } from 'redux';

class Profile extends React.Component {
  componentDidMount() {
    const { actions } = this.props;
    actions.fetchGithubShareData();
  }

  render() {
    return (
      <h1>
        Profile
      </h1>
    )
  }
}

function mapStateToProps(state) {
  return {...state.profile}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

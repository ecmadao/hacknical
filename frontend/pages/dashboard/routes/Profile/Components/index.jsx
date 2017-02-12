import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../redux/actions';

const ANALYSIS = [
  {
    id: 'github',
    title: 'github 分享数据'
  },
  {
    id: 'resume',
    title: '简历分享数据'
  }
];

import ShareAnalysis from './ShareAnalysis';

class Profile extends React.Component {

  render() {
    const { github, resume, actions } = this.props;

    return (
      <div>
        <ShareAnalysis
          actions={{
            fetchShareData: actions.fetchResumeShareData,
            postShareStatus: actions.postResumeShareStatus
          }}
          index={0}
          title={(
            <p><i aria-hidden="true" className="fa fa-file-code-o"></i>&nbsp;&nbsp;简历分享数据</p>
          )}
          {...resume}
        />
        <ShareAnalysis
          actions={{
            fetchShareData: actions.fetchGithubShareData,
            postShareStatus: actions.postGithubShareStatus
          }}
          index={1}
          title={(
            <p><i aria-hidden="true" className="fa fa-github"></i>&nbsp;&nbsp;github 分享数据</p>
          )}
          {...github}
        />
      </div>
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

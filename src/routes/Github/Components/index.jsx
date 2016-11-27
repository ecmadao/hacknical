import React from 'react';
import GitHubCalendar from 'github-calendar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'github-calendar/dist/github-calendar.css';

import '../styles/github.css';
import Loading from 'COMPONENTS/Loading';
import githubActions from '../redux/actions';
import UserInfoCard from './UserInfoCard';
import UserChartCard from './UserChartCard';

class Github extends React.Component {
  componentDidMount() {
    const { actions } = this.props;
    actions.getGithubInfo();
    actions.getRepos();
    // GitHubCalendar(".calendar", "ecmadao");
  }

  render() {
    const { user, repos } = this.props;
    return (
      <div className="github_info_container">
        {user ? <UserInfoCard user={user}/> : ''}
        <UserChartCard username={user.name}/>
        <div className="info_card_container">
          <p>活跃度</p>
          <div className="calendar github_calendar card">
            <Loading />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {
    loading,
    user
  } = state.github;
  return {
    loading,
    user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(githubActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Github);

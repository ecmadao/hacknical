import React from 'react';
import GitHubCalendar from 'github-calendar';
import { connect } from 'react-redux';
import 'github-calendar/dist/github-calendar.css';
import '../styles/github.css';
import Loading from 'COMPONENTS/Loading';
import githubActions from '../redux/actions';
import UserInfoCard from './UserInfoCard';
import UserChartCard from './UserChartCard';

class Github extends React.Component {
  componentDidMount() {
    const { getGithubInfo, getRepos } = this.props;
    getGithubInfo();
    getRepos();
    // GitHubCalendar(".calendar", "ecmadao");
  }

  render() {
    const { user, repos } = this.props;
    return (
      <div className="github_info_container">
        {user ? <UserInfoCard user={user}/> : ''}
        {repos.length ? <UserChartCard repos={repos} username={user.name}/> : ''}
        <div className="calendar github_calendar card">
          <Loading />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {loading, user, repos} = state.github;
  return {
    loading,
    user,
    repos
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getGithubInfo: () => {
      return dispatch(githubActions.getGithubInfo());
    },
    getRepos: () => {
      return dispatch(githubActions.getGithubRepos());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Github);

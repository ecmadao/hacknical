import React from 'react';
import GitHubCalendar from 'github-calendar';
import { connect } from 'react-redux';
import 'github-calendar/dist/github-calendar.css';
import '../styles/github.css';
import Loading from 'COMPONENTS/Loading';
import githubActions from '../redux/actions';

class Github extends React.Component {
  componentDidMount() {
    const {getGithubInfo} = this.props;
    getGithubInfo();
    GitHubCalendar(".calendar", "ecmadao");
  }

  render() {
    const {user} = this.props;
    console.log(user);
    return (
      <div className="github_info_container">
        <div className="calendar github_calendar">
          <Loading />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {loading, user} = state.github;
  return {
    loading,
    user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getGithubInfo: () => {
      return dispatch(githubActions.getGithubInfo());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Github);

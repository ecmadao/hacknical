import React from 'react';
import GitHubCalendar from 'github-calendar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'github-calendar/dist/github-calendar.css';

import '../styles/github.css';
import Loading from 'COMPONENTS/Loading';
import ReposModal from './ReposModal';
import githubActions from '../redux/actions';
import UserInfoCard from './UserInfoCard';
import UserChartCard from './UserChartCard';
import UserReposCard from './UserReposCard';

class Github extends React.Component {
  componentDidMount() {
    const { actions } = this.props;
    actions.getGithubInfo();
    GitHubCalendar(".calendar", "ecmadao");
  }

  render() {
    const { actions, user, repos, openModal } = this.props;
    return (
      <div className="github_info_container">
        <div className="info_card_container">
          <p><i aria-hidden="true" className="fa fa-cloud-upload"></i>&nbsp;&nbsp;活跃度</p>
          <div className="calendar github_calendar card">
            <Loading />
          </div>
        </div>
        <UserInfoCard user={user} />
        <UserChartCard />
        <UserReposCard />
        {openModal ? (
          <ReposModal
            openModal={openModal}
            onClose={() => actions.toggleModal(false)}
            onSave={() => {}}
          />
        ) : ''}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {
    loading,
    user,
    openModal
  } = state.github;
  return {
    loading,
    user,
    openModal
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(githubActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Github);

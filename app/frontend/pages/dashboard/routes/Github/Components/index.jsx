import React from 'react';
import GitHubCalendar from 'github-calendar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'github-calendar/dist/github-calendar.css';

import '../styles/github.css';
import '../styles/chart.css';
import githubActions from '../redux/actions';
import Loading from 'COMPONENTS/Loading';
import FloatingActionButton from 'COMPONENTS/FloatingActionButton';
import CommitInfo from 'COMPONENTS/Github/CommitInfo';
import LanguageInfo from 'COMPONENTS/Github/LanguageInfo';
import ReposInfo from 'COMPONENTS/Github/ReposInfo';

import ShareModal from './ShareModal';
import UserInfoCard from './UserInfoCard';
import { GREEN_COLORS } from 'UTILS/colors';

class Github extends React.Component {
  componentDidMount() {
    const { actions, repos } = this.props;
    actions.getGithubInfo();
    GitHubCalendar(".calendar", "ecmadao");
    if (!repos.length) {
      actions.getGithubRepos();
    }
  }

  render() {
    const {
      user,
      repos,
      actions,
      openModal,
      openShareModal,
      reposLanguages
    } = this.props;
    return (
      <div className="github_info_container">
        <div className="info_card_container">
          <p><i aria-hidden="true" className="fa fa-cloud-upload"></i>&nbsp;&nbsp;活跃度</p>
          <div className="calendar github_calendar card">
            <Loading />
          </div>
        </div>
        <UserInfoCard user={user} />
        <ReposInfo />
        <LanguageInfo />
        <CommitInfo />
        {openShareModal ? (
          <ShareModal
            login={user.login}
            openModal={openShareModal}
            onClose={() => actions.toggleShareModal(false)}
          />
        ) : ''}
        <FloatingActionButton
          icon="share-alt"
          style={{
            right: '20%',
            backgroundColor: GREEN_COLORS[1]
          }}
          onClick={() => actions.toggleShareModal(true)}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {
    user,
    repos,
    loading,
    openModal,
    openShareModal,
    reposLanguages
  } = state.github;
  return {
    user,
    repos,
    loading,
    openModal,
    openShareModal,
    reposLanguages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(githubActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Github);

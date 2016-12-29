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

import ReposModal from './ReposModal';
import ShareModal from './ShareModal';
import UserInfoCard from './UserInfoCard';
import ReposChart from './ReposChart';
import LanguageChart from './LanguageChart';
import CommitChart from './CommitChart';
import { GREEN_COLORS } from 'UTILS/colors';

class Github extends React.Component {
  componentDidMount() {
    const { actions } = this.props;
    actions.getGithubInfo();
    GitHubCalendar(".calendar", "ecmadao");
  }

  render() {
    const {
      user,
      repos,
      actions,
      openModal,
      openShareModal,
      chosedRepos,
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
        <ReposChart />
        <LanguageChart />
        <CommitChart />
        {/* {openModal ? (
          <ReposModal
          openModal={openModal}
          onClose={() => actions.toggleModal(false)}
          onSave={() => {}}
          repos={repos}
          languages={reposLanguages}
          selectedItems={chosedRepos}
          />
        ) : ''} */}
        {openShareModal ? (
          <ShareModal
            openModal={openShareModal}
            onClose={() => actions.toggleShareModal(false)}
          />
        ) : ''}
        <FloatingActionButton
          icon="eye"
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
    chosedRepos,
    reposLanguages
  } = state.github;
  return {
    user,
    repos,
    loading,
    openModal,
    openShareModal,
    chosedRepos,
    reposLanguages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(githubActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Github);

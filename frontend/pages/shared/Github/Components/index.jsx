import React from 'react';
import GitHubCalendar from 'github-calendar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import 'github-calendar/dist/github-calendar.css';

import { GREEN_COLORS } from 'UTILS/colors';
import Loading from 'COMPONENTS/Loading';
import FloatingActionButton from 'COMPONENTS/FloatingActionButton';
import CommitInfo from 'COMPONENTS/Github/CommitInfo';
import LanguageInfo from 'COMPONENTS/Github/LanguageInfo';
import RepositoryInfo from 'COMPONENTS/Github/RepositoryInfo';
import UserInfo from 'COMPONENTS/Github/UserInfo';

import ShareModal from './ShareModal';
import styles from '../styles/github.css';
import githubActions from '../redux/actions';


class Github extends React.Component {
  constructor(props) {
    super(props);
    this.githubCalendar = false;
  }

  componentDidMount() {
    const { actions, repos, login } = this.props;
    actions.getGithubInfo(login);
    if (!repos.length) {
      actions.getGithubRepos(login);
    }
  }

  componentDidUpdate() {
    const { user } = this.props;
    if (!this.githubCalendar && user.login) {
      this.githubCalendar = true;
      GitHubCalendar("#calendar", user.login);
    }
  }

  render() {
    const {
      user,
      repos,
      actions,
      openModal,
      isShare,
      openShareModal,
      reposLanguages
    } = this.props;
    const calendarClass = cx(
      styles["github_calendar"],
      styles["card"]
    );
    return (
      <div>
        <div className={styles["info_card_container"]}>
          <p><i aria-hidden="true" className="fa fa-cloud-upload"></i>&nbsp;&nbsp;活跃度</p>
          <div id="calendar" className={calendarClass}>
            <Loading />
          </div>
        </div>
        <UserInfo user={user} />
        <RepositoryInfo />
        <LanguageInfo />
        <CommitInfo />
        {openShareModal ? (
          <ShareModal
            login={user.login}
            openModal={openShareModal}
            onClose={() => actions.toggleShareModal(false)}
          />
        ) : ''}
        {!isShare ? (
          <FloatingActionButton
            icon="share-alt"
            style={{
              right: '20%',
              backgroundColor: GREEN_COLORS[1]
            }}
            onClick={() => actions.toggleShareModal(true)}
          />
        ) : ''}
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

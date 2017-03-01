import React, { PropTypes } from 'react';
import cx from 'classnames';
import objectAssign from 'object-assign';

import Api from 'API/index';
import { GREEN_COLORS } from 'UTILS/colors';
import Loading from 'COMPONENTS/Loading';
import FloatingActionButton from 'COMPONENTS/FloatingActionButton';
import Github from 'COMPONENTS/Github';
import ShareModal from 'SHAREDPAGE/components/ShareModal';

import USER from 'SRC/data/user';
import github from 'UTILS/github';
import {
  sortRepos
} from 'UTILS/helper';
import locales from 'LOCALES';
import styles from '../styles/github.css';

const githubLocales = locales('github');
const githubTexts = githubLocales.sections;
const shareText = githubLocales.modal.shareText;


class GithubComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loaded: false,
      openModal: false,
      openShareModal: false,
      user: objectAssign({}, USER),
      repos: [],
      reposLanguages: [],
      chosedRepos: [],
      showedReposId: null,
      commitDatas: [],
      commitInfos: [],
      sections: {}
    };
    this.changeShareStatus = this.changeShareStatus.bind(this);
    this.toggleShareModal = this.toggleShareModal.bind(this);
  }

  componentDidMount() {
    const { login } = this.props;
    const { repos, loaded } = this.state;
    this.getGithubInfo(login);
    if (!repos.length) {
      this.getGithubRepos(login);
    }
    this.gitGithubSections(login);
  }

  changeState(newState) {
    this.setState(newState);
  }

  async gitGithubSections(login = '') {
    const sections = await Api.user.getSections(login);
    this.setState({
      sections
    });
  }

  async getGithubInfo(login = '') {
    const user = await Api.github.getUser(login);
    this.changeState({ user });
    this.toggleLoading(false);
  }

  async getGithubRepos(login = '') {
    const result = await Api.github.getRepos(login);
    const { repos, commits } = result;
    this.setGithubRepos(result);
  }

  setGithubRepos(result) {
    const { repos, commits } = result;
    this.setState({
      loaded: true,
      repos: [...repos],
      commitDatas: [...commits],
      commitInfos: github.combineReposCommits([...commits]),
      reposLanguages: [...github.getReposLanguages(repos)]
    })
  }

  changeShareStatus() {
    const { user } = this.state;
    const { openShare } = user;
    Api.github.toggleShare(!openShare).then((result) => {
      this.toggleShare(!openShare);
    });
  }

  toggleShare(openShare) {
    const { user } = this.state;
    this.setState({
      user: objectAssign({}, user, {
        openShare
      })
    });
  }

  toggleLoading(loading) {
    this.setState({ loading });
  }

  toggleShareModal(openShareModal) {
    this.setState({ openShareModal })
  }

  render() {
    const {
      user,
      repos,
      openModal,
      openShareModal,
      reposLanguages,
      showedReposId,
      commitDatas,
      commitInfos,
      loaded
    } = this.state;
    const { isShare, containerStyle, githubSection } = this.props;
    const sections = Object.keys(githubSection).length ? githubSection : this.state.sections;

    const origin = window.location.origin;
    const GithubSection = Github(isShare);

    return (
      <div className={containerStyle}>
        {sections.hotmap !== false ? (
          <GithubSection
            userLogin={user.login}
            title={{
              text: githubTexts.hotmap.title,
              icon: 'cloud-upload'
            }}
            section="hotmap"
          />
        ) : ''}
        {sections.info !== false ? (
          <GithubSection
            user={user}
            title={{
              text: githubTexts.baseInfo.title,
              icon: 'vcard-o'
            }}
            section="info"
          />
        ) : ''}
        {sections.repos !== false ? (
          <GithubSection
            loaded={loaded}
            showedReposId={showedReposId}
            commitDatas={commitDatas}
            flatRepos={repos.filter(repository => !repository.fork).sort(sortRepos())}
            username={user && user.name}

            title={{
              text: githubTexts.repos.title,
              icon: 'bar-chart'
            }}
            section="repos"
          />
        ) : ''}
        {sections.orgs !== false ? (
          <GithubSection
            userLogin={user.login}
            title={{
              text: githubTexts.orgs.title,
              icon: 'rocket'
            }}
            section="orgs"
          />
        ) : ''}
        {sections.languages !== false ? (
          <GithubSection
            repos={repos}
            loaded={repos.length > 0}
            showedReposId={showedReposId}
            languageDistributions={github.getLanguageDistribution(repos)}
            languageUsed={github.getLanguageUsed(repos)}
            languageSkills={github.getLanguageSkill(repos)}

            title={{
              text: githubTexts.languages.title,
              icon: 'code'
            }}
            section="languages"
          />
        ) : ''}
        {sections.commits !== false ? (
          <GithubSection
            loaded={loaded}
            commitDatas={commitDatas}
            commitInfos={commitInfos}
            hasCommits={commitDatas.length > 0}

            title={{
              text: githubTexts.commits.title,
              icon: 'git'
            }}
            section="commits"
          />
        ) : ''}
        {openShareModal ? (
          <ShareModal
            openModal={openShareModal}
            options={{
              openShare: user.openShare,
              link: `${origin}/${user.shareUrl}`,
              text: shareText
            }}
            toggleShare={this.changeShareStatus}
            onClose={() => this.toggleShareModal(false)}
          />
        ) : ''}
        {!isShare ? (
          <FloatingActionButton
            icon="share-alt"
            style={{
              right: '20%',
              backgroundColor: GREEN_COLORS[1]
            }}
            onClick={() => this.toggleShareModal(true)}
          />
        ) : ''}
      </div>
    )
  }
}

GithubComponent.propTypes = {
  login: PropTypes.string,
  isShare: PropTypes.bool,
  githubSection: PropTypes.object,
  containerStyle: PropTypes.string,
};

GithubComponent.defaultProps = {
  login: '',
  isShare: false,
  githubSection: {},
  containerStyle: '',
};

export default GithubComponent;

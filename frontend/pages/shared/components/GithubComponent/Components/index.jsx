import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import objectAssign from 'UTILS/object-assign';
import { FloatingActionButton } from 'light-ui';
import Api from 'API';
import GitHubSection from 'COMPONENTS/Github/GithubSection';
import ShareModal from 'SHARED/components/ShareModal';
import USER from 'SRC/data/user';
import github from 'UTILS/github';
import locales from 'LOCALES';
import styles from '../styles/github.css';
import dateHelper from 'UTILS/date';

const githubLocales = locales('github');
const githubTexts = githubLocales.sections;
const shareText = githubLocales.modal.shareText;
const { hoursBefore } = dateHelper.relative;

class GithubComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      sections: {},
      chosedRepos: [],
      commitDatas: [],
      commitInfos: [],
      repositories: [],
      openModal: false,
      commitLoaded: false,
      openShareModal: false,
      repositoriesLoaded: false,
      user: objectAssign({}, USER),
    };
    this.changeShareStatus = this.changeShareStatus.bind(this);
    this.toggleShareModal = this.toggleShareModal.bind(this);
    this.changeGithubSection = this.changeGithubSection.bind(this);
  }

  componentDidMount() {
    const { login } = this.props;
    this.getGithubUser(login);
  }

  componentDidUpdate(preProps, preState) {
    const {
      user,
      commitLoaded,
      repositoriesLoaded,
    } = this.state;

    this.removeLoading('#loading');

    if (!preState.user.login && user.login) {
      this.getGithubSections(user.login);
      // this.getGithubScientific(user.login);
      !repositoriesLoaded && this.getGithubRepositories(user.login);
    }
    if (repositoriesLoaded && !preState.repositoriesLoaded) {
      !commitLoaded && this.getGithubCommits(user.login);
    }
  }

  removeLoading(dom) {
    $(dom) && $(dom).remove();
  }

  changeState(newState) {
    this.setState(newState);
  }

  async getGithubScientific(login = '') {
    const scientific = await Api.github.getUserScientific(login);
    console.log(scientific);
    const predictions = await Api.github.getUserPredictions(login);
    console.log(predictions);
  }

  async getGithubUser(login = '') {
    const user = await Api.github.getUser(login);
    this.changeState({ user });
    this.toggleLoading(false);
  }

  async getGithubRepositories(login = '') {
    const { repositories } = await Api.github.getRepositories(login);
    this.setGithubRepositories(repositories);
  }

  async getGithubSections(login = '') {
    const sections = await Api.user.getSections(login);
    this.changeState({ sections });
  }

  async getGithubCommits(login = '') {
    const result = await Api.github.getCommits(login);
    this.setGithubCommits(result);
  }

  setGithubRepositories(repositories = []) {
    this.setState({
      repositoriesLoaded: true,
      repositories: [...repositories],
    });
  }

  setGithubCommits(result) {
    const {
      commits = [],
      formatCommits = {}
    } = result;
    this.setState({
      commitLoaded: true,
      commitDatas: [...commits],
      commitInfos: formatCommits,
    });
  }

  async changeShareStatus() {
    const { user } = this.state;
    const { openShare } = user;
    await Api.github.toggleShare(!openShare);
    this.toggleShare(!openShare);
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
    this.setState({ openShareModal });
  }

  async changeGithubSection(sections) {
    await Api.user.setSections(sections);
    this.setState({
      sections: objectAssign({}, this.state.sections, sections)
    });
  }

  disabledSection(section) {
    const { sections } = this.state;
    const { isShare, githubSection } = this.props;
    return !isShare && (sections[section] === false || githubSection[section] === false);
  }

  hideSection(section) {
    const { sections } = this.state;
    const { isShare, githubSection } = this.props;
    const shareSections = Object.keys(githubSection).length
      ? githubSection
      : sections;
    return isShare && shareSections[section] === false;
  }

  render() {
    const {
      user,
      sections,
      repositories,
      commitDatas,
      commitInfos,
      commitLoaded,
      openShareModal,
      repositoriesLoaded,
    } = this.state;
    const { isShare, containerStyle } = this.props;

    const origin = window.location.origin;
    const { login, lastUpdateTime, openShare, shareUrl } = user;

    const forkedRepositories = [];
    const ownedRepositories = [];
    for (let i = 0; i < repositories.length; i += 1) {
      const repository = repositories[i];
      if (repository.fork) {
        forkedRepositories.push(repository);
      } else {
        ownedRepositories.push(repository);
      }
    }

    return (
      <div
        className={cx(
          styles.container,
          containerStyle
        )}
      >
        {isShare ? (
          <div className={styles.shareInfo}>
            {githubLocales.updateAt}{hoursBefore(lastUpdateTime)}
          </div>
        ) : ''}
        <GitHubSection
          login={login}
          title={{
            text: githubTexts.hotmap.title,
            icon: 'cloud-upload'
          }}
          section="hotmap"
          sectionStatus={sections.hotmap}
          hide={this.hideSection('hotmap')}
          disabled={this.disabledSection('hotmap')}
          isShare={isShare}
          callback={this.changeGithubSection}
        />
        <GitHubSection
          user={user}
          title={{
            text: githubTexts.baseInfo.title,
            icon: 'vcard-o'
          }}
          section="info"
          key="github-section-info"
          sectionStatus={sections.info}
          hide={this.hideSection('info')}
          disabled={this.disabledSection('info')}
          isShare={isShare}
          callback={this.changeGithubSection}
        />
        <GitHubSection
          loaded={repositoriesLoaded || commitLoaded}
          commitDatas={commitDatas}
          ownedRepositories={ownedRepositories}
          forkedRepositories={forkedRepositories}
          title={{
            text: githubTexts.repos.title,
            icon: 'bar-chart'
          }}
          section="repos"
          key="github-section-repos"
          sectionStatus={sections.repos}
          hide={this.hideSection('repos')}
          disabled={this.disabledSection('repos')}
          intro={{
            icon: 'question-circle',
            text: githubTexts.repos.tipso
          }}
          isShare={isShare}
          callback={this.changeGithubSection}
        />
        <GitHubSection
          loaded={repositoriesLoaded}
          repositories={ownedRepositories}
          title={{
            text: githubTexts.course.title,
            icon: 'trophy'
          }}
          section="course"
          key="github-section-course"
          sectionStatus={sections.course}
          hide={this.hideSection('course')}
          disabled={this.disabledSection('course')}
          intro={{
            icon: 'question-circle',
            text: githubTexts.course.tipso
          }}
          isShare={isShare}
          callback={this.changeGithubSection}
        />
        <GitHubSection
          login={login}
          userLogin={this.props.login}
          title={{
            text: githubTexts.contributed.title,
            icon: 'plug'
          }}
          section="contributed"
          key="github-section-contributed"
          sectionStatus={sections.contributed}
          hide={this.hideSection('contributed')}
          disabled={this.disabledSection('contributed')}
          intro={{
            icon: 'question-circle',
            text: githubTexts.contributed.tipso
          }}
          isShare={isShare}
          callback={this.changeGithubSection}
        />
        <GitHubSection
          login={login}
          userLogin={this.props.login}
          title={{
            text: githubTexts.orgs.title,
            icon: 'rocket'
          }}
          section="orgs"
          key="github-section-orgs"
          sectionStatus={sections.orgs}
          hide={this.hideSection('orgs')}
          disabled={this.disabledSection('orgs')}
          intro={{
            icon: 'question-circle',
            text: githubTexts.orgs.tipso
          }}
          isShare={isShare}
          callback={this.changeGithubSection}
        />
        <GitHubSection
          repositories={repositories}
          loaded={repositoriesLoaded}
          languageDistributions={github.getLanguageDistribution(repositories)}
          languageUsed={github.getLanguageUsed(repositories)}
          languageSkills={github.getLanguageSkill(repositories)}
          title={{
            text: githubTexts.languages.title,
            icon: 'code'
          }}
          section="languages"
          key="github-section-languages"
          sectionStatus={sections.languages}
          hide={this.hideSection('languages')}
          disabled={this.disabledSection('languages')}
          isShare={isShare}
          callback={this.changeGithubSection}
        />
        <GitHubSection
          loaded={commitLoaded}
          commitDatas={commitDatas}
          commitInfos={commitInfos}
          hasCommits={commitDatas.length > 0}
          title={{
            text: githubTexts.commits.title,
            icon: 'git'
          }}
          intro={{
            icon: 'question-circle',
            text: githubTexts.commits.tipso
          }}
          section="commits"
          key="github-section-commits"
          sectionStatus={sections.commits}
          hide={this.hideSection('commits')}
          disabled={this.disabledSection('commits')}
          isShare={isShare}
          callback={this.changeGithubSection}
        />
        {openShareModal ? (
          <ShareModal
            openModal={openShareModal}
            options={{
              openShare,
              link: `${origin}/${shareUrl}`,
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
              position: 'fixed',
              bottom: '30px',
              right: '20%',
              zIndex: '11'
            }}
            color="green"
            onClick={() => this.toggleShareModal(true)}
          />
        ) : ''}
      </div>
    );
  }
}

GithubComponent.propTypes = {
  login: PropTypes.string,
  isShare: PropTypes.bool,
  githubSection: PropTypes.object,
  containerStyle: PropTypes.string,
};

GithubComponent.defaultProps = {
  login: window.login,
  isShare: false,
  githubSection: {},
  containerStyle: '',
};

export default GithubComponent;

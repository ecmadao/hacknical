import React, { PropTypes } from 'react';
import cx from 'classnames';
import objectAssign from 'object-assign';
import { FloatingActionButton } from 'light-ui';
import Api from 'API/index';
import GitHubSection from 'COMPONENTS/Github/GithubSection';
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
      reposLoaded: false,
      commitLoaded: false,
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
    this.changeGithubSection = this.changeGithubSection.bind(this);
  }

  componentDidMount() {
    const { login } = this.props;
    this.getGithubUser(login);
  }

  componentDidUpdate(preProps, preState) {
    const {
      user,
      reposLoaded,
      commitLoaded
    } = this.state;

    if (!preState.user.login && user.login) {
      this.getGithubSections(user.login);
      !reposLoaded && this.getGithubRepos(user.login);
    }
    if (reposLoaded && !preState.reposLoaded) {
      !commitLoaded && this.getGithubCommits(user.login);
    }
  }

  changeState(newState) {
    this.setState(newState);
  }

  async getGithubUser(login = '') {
    const user = await Api.github.getUser(login);
    this.changeState({ user });
    this.toggleLoading(false);
  }

  async getGithubRepos(login = '') {
    const result = await Api.github.getRepos(login);
    this.setGithubRepos(result);
  }

  async getGithubSections(login = '') {
    const sections = await Api.user.getSections(login);
    this.changeState({ sections });
  }

  async getGithubCommits(login = '') {
    const result = await Api.github.getCommits(login);
    this.setGithubCommits(result);
  }

  setGithubRepos(result) {
    const { repos } = result;
    this.setState({
      reposLoaded: true,
      repos: [...repos],
      reposLanguages: [...github.getReposLanguages(repos)]
    })
  }

  setGithubCommits(result) {
    const { commits } = result;
    this.setState({
      commitLoaded: true,
      commitDatas: [...commits],
      commitInfos: github.combineReposCommits([...commits])
    })
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
    this.setState({ openShareModal })
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
    const shareSections = Object.keys(githubSection).length ? githubSection : sections;
    return isShare && shareSections[section] === false;
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
      reposLoaded,
      commitLoaded,
      sections
    } = this.state;
    const { isShare, containerStyle } = this.props;
    const origin = window.location.origin;

    // console.log(commitDatas)
    // console.log(commitInfos)

    return (
      <div className={cx(
          styles.container,
          containerStyle
        )}>
        <GitHubSection
          userLogin={user.login}
          title={{
            text: githubTexts.hotmap.title,
            icon: 'cloud-upload'
          }}
          section="hotmap"
          sectionStatus={sections["hotmap"]}
          hide={this.hideSection("hotmap")}
          disabled={this.disabledSection("hotmap")}
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
          sectionStatus={sections["info"]}
          hide={this.hideSection("info")}
          disabled={this.disabledSection("info")}
          isShare={isShare}
          callback={this.changeGithubSection}
        />
        <GitHubSection
          loaded={reposLoaded || commitLoaded}
          commitDatas={commitDatas}
          userRepos={repos.filter(repository => !repository.fork).sort(sortRepos())}
          forkedRepos={repos.filter(repository => repository.fork)}

          title={{
            text: githubTexts.repos.title,
            icon: 'bar-chart'
          }}
          section="repos"
          key="github-section-repos"
          sectionStatus={sections["repos"]}
          hide={this.hideSection("repos")}
          disabled={this.disabledSection("repos")}
          intro={{
            icon: 'question-circle',
            text: githubTexts.repos.tipso
          }}
          isShare={isShare}
          callback={this.changeGithubSection}
        />
        <GitHubSection
          loaded={reposLoaded}
          showedReposId={showedReposId}
          userRepos={repos.filter(repository => !repository.fork).sort(sortRepos())}

          title={{
            text: githubTexts.course.title,
            icon: 'trophy'
          }}
          section="course"
          key="github-section-course"
          sectionStatus={sections["course"]}
          hide={this.hideSection("course")}
          disabled={this.disabledSection("course")}
          intro={{
            icon: 'question-circle',
            text: githubTexts.course.tipso
          }}
          isShare={isShare}
          callback={this.changeGithubSection}
        />
        <GitHubSection
          userLogin={user.login}
          title={{
            text: githubTexts.orgs.title,
            icon: 'rocket'
          }}
          section="orgs"
          key="github-section-orgs"
          sectionStatus={sections["orgs"]}
          hide={this.hideSection("orgs")}
          disabled={this.disabledSection("orgs")}
          intro={{
            icon: 'question-circle',
            text: githubTexts.orgs.tipso
          }}
          isShare={isShare}
          callback={this.changeGithubSection}
        />
        <GitHubSection
          repos={repos}
          loaded={reposLoaded}
          showedReposId={showedReposId}
          languageDistributions={github.getLanguageDistribution(repos)}
          languageUsed={github.getLanguageUsed(repos)}
          languageSkills={github.getLanguageSkill(repos)}

          title={{
            text: githubTexts.languages.title,
            icon: 'code'
          }}
          section="languages"
          key="github-section-languages"
          sectionStatus={sections["languages"]}
          hide={this.hideSection("languages")}
          disabled={this.disabledSection("languages")}
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
          sectionStatus={sections["commits"]}
          hide={this.hideSection("commits")}
          disabled={this.disabledSection("commits")}
          isShare={isShare}
          callback={this.changeGithubSection}
        />
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
              position: 'fixed',
              bottom: '30px',
              right: '20%'
            }}
            color="green"
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

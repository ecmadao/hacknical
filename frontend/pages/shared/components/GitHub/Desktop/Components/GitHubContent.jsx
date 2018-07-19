import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import objectAssign from 'UTILS/object-assign';
import FAB from 'COMPONENTS/FloatingActionButton';
import API from 'API';
import GitHub from 'COMPONENTS/GitHub';
import ShareModal from 'COMPONENTS/ShareModal';
import locales from 'LOCALES';
import styles from '../styles/github.css';
import dateHelper from 'UTILS/date';

const githubLocales = locales('github');
const githubTexts = githubLocales.sections;
const shareText = githubLocales.modal.shareText;
const { secondsBefore } = dateHelper.relative;

class GitHubContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: {},
      openShareModal: false
    };
    this.toggleShareModal = this.toggleShareModal.bind(this);
  }

  componentDidUpdate(preProps) {
    const { user } = this.props;

    if (!preProps.user.login && user.login) {
      this.fetchGithubSections(user.login);
    }
  }

  toggleShareModal(openShareModal) {
    this.setState({ openShareModal });
  }

  async fetchGithubSections(login = '') {
    const userInfo = await API.user.getUserInfo(login);
    this.setState({ sections: userInfo.githubSections });
  }

  async changeGithubSection(sections) {
    const githubSections = objectAssign({}, this.state.sections, sections);
    await API.user.setUserInfo({ githubSections });
    this.setState({ sections: githubSections });
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
      hotmap,
      languages,
      commitDatas,
      commitInfos,
      repositories,
      commitLoaded,
      languageUsed,
      hotmapLoaded,
      languageSkills,
      repositoriesLoaded,
      languageDistributions,
    } = this.props;

    const { sections, openShareModal } = this.state;
    const { isShare, containerClass, cardClass } = this.props;

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
          containerClass
        )}
      >
        {isShare ? (
          <div className={styles.shareInfo}>
            {githubLocales.updateAt}{secondsBefore(lastUpdateTime)}
          </div>
        ) : null}
        <GitHub
          login={login}
          hotmap={hotmap}
          loaded={hotmapLoaded}
          title={{
            text: githubTexts.hotmap.title,
            icon: 'cloud-upload'
          }}
          section="hotmap"
          sectionStatus={sections.hotmap}
          hide={this.hideSection('hotmap')}
          disabled={this.disabledSection('hotmap')}
          isShare={isShare}
          cardClass={cardClass}
          callback={this.changeGithubSection}
          intro={{
            icon: 'question-circle',
            text: githubTexts.hotmap.tipso
          }}
        />
        <GitHub
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
          cardClass={cardClass}
          callback={this.changeGithubSection}
        />
        <GitHub
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
          cardClass={cardClass}
          callback={this.changeGithubSection}
        />
        <GitHub
          loaded={repositoriesLoaded}
          repositories={ownedRepositories}
          commitDatas={commitDatas}
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
          cardClass={cardClass}
          callback={this.changeGithubSection}
        />
        <GitHub
          languages={languages}
          repositories={repositories}
          loaded={repositoriesLoaded}
          languageUsed={languageUsed}
          languageSkills={languageSkills}
          languageDistributions={languageDistributions}
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
          cardClass={cardClass}
          callback={this.changeGithubSection}
        />
        <GitHub
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
          cardClass={cardClass}
          callback={this.changeGithubSection}
        />
        <GitHub
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
          cardClass={cardClass}
          callback={this.changeGithubSection}
        />
        <GitHub
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
          cardClass={cardClass}
          callback={this.changeGithubSection}
        />
        {!isShare ? (
          <ShareModal
            openModal={openShareModal}
            options={{
              openShare,
              link: `${origin}/${shareUrl}`,
              text: shareText
            }}
            onClose={() => this.toggleShareModal(false)}
          />
        ) : null}
        {!isShare ? (
          <FAB
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
        ) : null}
      </div>
    );
  }
}

GitHubContent.propTypes = {
  login: PropTypes.string,
  isShare: PropTypes.bool,
  githubSection: PropTypes.object,
  containerClass: PropTypes.string,
  cardClass: PropTypes.string,
};

GitHubContent.defaultProps = {
  login: window.login,
  isShare: false,
  githubSection: {},
  containerClass: '',
  cardClass: '',
};

export default GitHubContent;

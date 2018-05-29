import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import objectAssign from 'UTILS/object-assign';
import FAB from 'COMPONENTS/FloatingActionButton';
import Api from 'API';
import GitHub from 'COMPONENTS/GitHub';
import ShareModal from 'SHARED/components/ShareModal';
import USER from 'SRC/data/user';
import github from 'UTILS/github';
import locales from 'LOCALES';
import styles from '../styles/github.css';
import dateHelper from 'UTILS/date';
import {
  removeDOM,
} from 'UTILS/helper';

const githubLocales = locales('github');
const githubTexts = githubLocales.sections;
const shareText = githubLocales.modal.shareText;
const { secondsBefore } = dateHelper.relative;
const sortByLanguageStar = github.sortByX({ key: 'stargazers_count' });

class GitHubComponent extends React.Component {
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
      statisticLoaded: false,
      user: objectAssign({}, USER),
      scientific: {
        statistic: null,
        predictions: []
      },
    };
    this.onPredictionFeedback = this.onPredictionFeedback.bind(this);
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
      scientific,
      commitLoaded,
      repositoriesLoaded,
    } = this.state;
    const { isShare } = this.props;

    if (!preState.user.login && user.login) {
      this.getGithubSections(user.login);
      // !isShare && this.getGithubScientific(user.login);
      // !scientific.statistic && this.getGithubStatistic(user.login);
      !repositoriesLoaded && this.getGithubRepositories(user.login);
      setTimeout(() => removeDOM('#loading'), 1000);
    }
    if (repositoriesLoaded && !preState.repositoriesLoaded) {
      !commitLoaded && this.getGithubCommits(user.login);
    }
  }

  changeState(newState) {
    this.setState(newState);
  }

  async getGithubStatistic(login = '') {
    const statistic = await Api.scientific.getUserStatistic(login);
    const { scientific } = this.state;
    this.setState({
      statisticLoaded: true,
      scientific: objectAssign(scientific, { statistic: statistic || null })
    });
  }

  async getGithubScientific(login = '') {
    const predictions = await Api.scientific.getUserPredictions(login);
    const { scientific } = this.state;
    this.setState({
      scientific: objectAssign(scientific, { predictions: predictions || [] })
    });
  }

  onPredictionUpdate(index, liked) {
    const { scientific, user } = this.state;
    const { login } = user;
    const prediction = scientific.predictions[index];
    const likedCount = prediction.likedCount + liked;
    const predictions = [
      ...scientific.predictions.slice(0, index),
      objectAssign({}, prediction, {
        liked,
        likedCount: likedCount >= 0 ? likedCount : 0
      }),
      ...scientific.predictions.slice(index + 1)
    ];
    this.setState({
      scientific: objectAssign({}, scientific, {
        predictions
      })
    });
    Api.scientific.putPredictionFeedback(login, prediction.full_name, liked);
  }

  onPredictionDelete(index) {
    const { scientific, user } = this.state;
    const { login } = user;
    const prediction = scientific.predictions[index];
    const predictions = [
      ...scientific.predictions.slice(0, index),
      ...scientific.predictions.slice(index + 1)
    ];
    this.setState({
      scientific: objectAssign({}, scientific, {
        predictions
      })
    });
    Api.scientific.removePrediction(login, prediction.full_name);
  }

  onPredictionFeedback(index, liked) {
    if (liked === -2) {
      this.onPredictionDelete(index, liked);
    } else {
      this.onPredictionUpdate(index, liked);
    }
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
    const userInfo = await Api.user.getUserInfo(login);
    this.changeState({ sections: userInfo.githubSections });
  }

  async getGithubCommits(login = '') {
    const result = await Api.github.getCommits(login);
    this.setGithubCommits(result);
  }

  setGithubRepositories(repositories = []) {
    this.setState({
      repositoriesLoaded: true,
      repositories: [...repositories.sort(sortByLanguageStar)],
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
    const newSections = objectAssign({}, this.state.sections, sections);
    await Api.user.setUserInfo({
      githubSections: newSections
    });
    this.setState({
      sections: newSections
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
      scientific,
      commitDatas,
      commitInfos,
      repositories,
      commitLoaded,
      openShareModal,
      statisticLoaded,
      repositoriesLoaded,
    } = this.state;
    const { isShare, containerClass, cardClass } = this.props;
    const { predictions, statistic } = scientific;

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
        ) : ''}
        <GitHub
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
        {/*
        <GitHub
          title={{
            text: githubTexts.predictions.title,
            icon: 'github-alt'
          }}
          intro={{
            icon: 'question-circle',
            text: githubTexts.predictions.tipso
          }}
          predictions={predictions}
          section="predictions"
          key="github-section-predictions"
          cardClass={styles.scientificWrapper}
          hide={isShare || !predictions.length}
          onFeedback={this.onPredictionFeedback}
          canOperate={false}
        />
        */}
        {/*
        <GitHub
          loaded={statisticLoaded}
          title={{
            text: githubTexts.statistic.title,
            icon: 'star',
          }}
          intro={{
            icon: 'question-circle',
            text: githubTexts.statistic.tipso
          }}
          section="statistic"
          key="github-section-statistic"
          statistic={statistic}
          isShare={isShare}
          sectionStatus={sections.statistic}
          callback={this.changeGithubSection}
          disabled={this.disabledSection('statistic')}
          hide={this.hideSection('statistic')}
        />
        */}
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
            toggleShare={this.changeShareStatus}
            onClose={() => this.toggleShareModal(false)}
          />
        ) : ''}
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
        ) : ''}
      </div>
    );
  }
}

GitHubComponent.propTypes = {
  login: PropTypes.string,
  isShare: PropTypes.bool,
  githubSection: PropTypes.object,
  containerClass: PropTypes.string,
  cardClass: PropTypes.string,
};

GitHubComponent.defaultProps = {
  login: window.login,
  isShare: false,
  githubSection: {},
  containerClass: '',
  cardClass: '',
};

export default GitHubComponent;

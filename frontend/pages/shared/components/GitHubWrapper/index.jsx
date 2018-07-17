
import React, { cloneElement } from 'react';
import { polyfill } from 'es6-promise';
import objectAssign from 'UTILS/object-assign';
import { USER } from 'UTILS/constant';
import Api from 'API';
import github from 'UTILS/github';
import { removeDOM } from 'UTILS/helper';

polyfill();

const sortByLanguageStar = github.sortByX({ key: 'stargazers_count' });

class GitHubWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      languages: {},
      chosedRepos: [],
      commitDatas: [],
      commitInfos: {
        dailyCommits: [],
        total: 0,
        commits: []
      },
      repositories: [],
      openModal: false,
      commitLoaded: false,
      repositoriesLoaded: false,
      statisticLoaded: false,
      user: objectAssign({}, USER),
      scientific: {
        statistic: null,
        predictions: []
      },
      languageUsed: {},
      languageSkills: {},
      languageDistributions: {},
    };
    this.changeShareStatus = this.changeShareStatus.bind(this);
  }

  componentDidMount() {
    const { login } = this.props;
    this.fetchGithubUser(login);
    Promise.all([
      this.fetchGithubUser(login),
      this.fetchLanguages(login),
      this.fetchGithubCommits(login),
      this.fetchGithubRepositories(login),
    ]);
    removeDOM('#loading', { async: true });
  }

  async fetchGithubStatistic(login = '') {
    const statistic = await Api.scientific.getUserStatistic(login);
    const { scientific } = this.state;
    this.setState({
      statisticLoaded: true,
      scientific: objectAssign(scientific, { statistic: statistic || null })
    });
  }

  async fetchGithubScientific(login = '') {
    const predictions = await Api.scientific.getUserPredictions(login);
    const { scientific } = this.state;
    this.setState({
      scientific: objectAssign(scientific, { predictions: predictions || [] })
    });
  }

  async fetchGithubUser(login = '') {
    const user = await Api.github.getUser(login);
    this.setState({ user, loading: false });
  }

  async fetchGithubRepositories(login = '') {
    const repositories = await Api.github.getRepositories(login);
    this.setState({
      repositoriesLoaded: true,
      languageUsed: github.getLanguageUsed(repositories),
      languageSkills: github.getLanguageSkill(repositories),
      repositories: [...repositories.sort(sortByLanguageStar)],
      languageDistributions: github.getLanguageDistribution(repositories),
    });
  }

  async fetchGithubCommits(login = '') {
    const result = await Api.github.getCommits(login);
    this.setGithubCommits(result);
  }

  async fetchLanguages(login = '') {
    const result = await Api.github.getLanguages(login);
    this.setState({ languages: result });
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

  render() {
    const { children } = this.props;

    const component = cloneElement(children, {
      ...this.state,
      changeShareStatus: this.changeShareStatus
    });
    return component;
  }
}

export default GitHubWrapper;

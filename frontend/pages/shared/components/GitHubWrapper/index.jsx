
import React, { cloneElement } from 'react';
import { polyfill } from 'es6-promise';
import objectAssign from 'UTILS/object-assign';
import { USER } from 'UTILS/constant';
import API from 'API';
import locales from 'LOCALES';
import github from 'UTILS/github';
import { removeDOM } from 'UTILS/helper';
import formatHotmap from 'UTILS/hotmap';
import HeartBeat from 'UTILS/heartbeat';
import message from 'UTILS/message';

polyfill();

const githubMsg = locales('github.message');

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
      hotmapLoaded: false,
      hotmap: {
        start: null,
        end: null,
        datas: null,
        total: null,
        streak: null,
      }
    };
    this.onRefresh = this.onRefresh.bind(this);
    this.setRefreshStatus = this.setRefreshStatus.bind(this);
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
      this.fetchUpdateStatus()
    ]);
    this.fetchHotmap(login);
    removeDOM('#loading', { async: true });
  }

  componentWillUnmount() {
    this.heartBeat && this.heartBeat.stop();
  }

  async fetchGithubStatistic(login = '') {
    const statistic = await API.scientific.getUserStatistic(login);
    const { scientific } = this.state;
    this.setState({
      statisticLoaded: true,
      scientific: objectAssign(scientific, { statistic: statistic || null })
    });
  }

  async fetchGithubScientific(login = '') {
    const predictions = await API.scientific.getUserPredictions(login);
    const { scientific } = this.state;
    this.setState({
      scientific: objectAssign(scientific, { predictions: predictions || [] })
    });
  }

  async fetchGithubUser(login = '') {
    const user = await API.github.getUser(login);
    this.setState({ user, loading: false });
  }

  async fetchGithubRepositories(login = '') {
    const repositories = await API.github.getRepositories(login);
    this.setState({
      repositoriesLoaded: true,
      languageUsed: github.getLanguageUsed(repositories),
      languageSkills: github.getLanguageSkill(repositories),
      repositories: [...repositories.sort(sortByLanguageStar)],
      languageDistributions: github.getLanguageDistribution(repositories),
    });
  }

  async fetchGithubCommits(login = '') {
    const result = await API.github.getCommits(login);
    this.setGithubCommits(result);
  }

  async fetchLanguages(login = '') {
    const result = await API.github.getLanguages(login);
    this.setState({ languages: result });
  }

  async fetchHotmap(login) {
    const result = await API.github.getUserHotmap(login);
    const hotmap = formatHotmap(result);
    this.setState({ hotmap, hotmapLoaded: true });
  }

  async fetchUpdateStatus() {
    const { isAdmin } = this.props;
    if (!isAdmin) return;
    const result = await API.github.getUpdateStatus();
    this.setRefreshStatus(result);
  }

  setRefreshStatus(data) {
    const { refreshing, refreshEnable } = data;
    this.setState({
      refreshing,
      refreshEnable,
    });
    if (refreshing && !this.heartBeat) {
      this.createRefresh();
    }
  }

  createRefresh() {
    if (this.heartBeat) return;
    this.heartBeat = new HeartBeat({
      interval: 4000, // 4s
      callback: () => API.github.getUpdateStatus().then((result) => {
        if (!result) return;
        if (result.finished) {
          this.heartBeat.stop();
          this.setRefreshStatus(result);
          message.notice(githubMsg.update);
          setTimeout(() => {
            window.location.reload(false);
          }, 3000);
        }
      })
    });
    this.heartBeat.takeoff();
  }

  onRefresh() {
    const { refreshEnable } = this.state;
    if (!refreshEnable) {
      message.error(githubMsg.update.error);
      return;
    }
    this.setRefreshStatus({
      refreshing: true,
      refreshEnable: false
    });
    API.github.update().then(this.createRefresh);
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
    API.scientific.putPredictionFeedback(login, prediction.full_name, liked);
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
    API.scientific.removePrediction(login, prediction.full_name);
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
    await API.github.toggleShare(!openShare);
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
      onRefresh: this.onRefresh
    });
    return component;
  }
}

GitHubWrapper.defaultProps = {
  isShare: false,
  login: window.login,
  isAdmin: window.isAdmin === 'true',
};

export default GitHubWrapper;

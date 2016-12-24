import { createAction, createActions } from 'redux-actions';
import objectAssign from 'object-assign';
import Api from 'API/index';
import github from 'UTILS/github';

import CHOSED_REPOS from 'MOCK/chosed_repos';

const {
  toggleModal,
  toggleLoading,
  setGithubInfo,
  setGithubCommits,
  setGithubRepos,
  closeReposReadme,
  setShowLanguage,
  setShowedReposId,
  setChosedRepos
} = createActions(
  'TOGGLE_MODAL',
  'TOGGLE_LOADING',
  'SET_GITHUB_INFO',
  'SET_GITHUB_COMMITS',
  'SET_GITHUB_REPOS',
  'CLOSE_REPOS_README',
  'SET_SHOW_LANGUAGE',
  'SET_SHOWED_REPOS_ID',
  'SET_CHOSED_REPOS'
);

const getGithubInfo = () => (dispatch, getState) => {
  Api.github.getUser().then((result) => {
    dispatch(setGithubInfo(result));
    dispatch(toggleLoading(false));
  });
};

const getGithubRepos = () => (dispatch, getState) => {
  Api.github.getRepos().then((result) => {
    dispatch(setGithubRepos(result));
  });
};

const fetchGithubCommits = () => (dispatch, getState) => {
  // TODO
  // If user login in first, he may has bug that get no commits
  Api.github.getCommits().then((result) => {
    const commits = github.combineReposCommits(result);
    console.log('commits');
    console.log(commits);
    dispatch(setGithubCommits(commits));
  });
};

const showReposReadme = (url, reposId) => (dispatch, getState) => {
  const { chosedRepos } = getState().github;
  const filteredRepos = chosedRepos.filter(repository => repository.id === reposId && repository.readme);
  dispatch(setShowedReposId(reposId));
  if (!filteredRepos.length) {
    dispatch(fetchReposReadme(url, reposId));
  }
};

const fetchReposReadme = (url, reposId) => (dispatch, getState) => {
  $.ajax({
    url: `https://api.github.com/repos/${url}/readme`,
    method: 'GET',
    dataType: 'html',
    headers: {
      Accept: 'application/vnd.github.v3.html'
    }
  }).done(readme => {
    const { chosedRepos } = getState().github;
    const repos = chosedRepos.map((repository) => {
      if (repository.id === reposId) {
        return objectAssign({}, repository, { readme });
      }
      return repository;
    });
    dispatch(setChosedRepos(repos));
  });
};

const choseRepos = () => (dispatch, getState) => {
  dispatch(setChosedRepos(CHOSED_REPOS));
};

export default {
  setGithubInfo,
  getGithubInfo,
  toggleModal,
  toggleLoading,
  setGithubRepos,
  setGithubCommits,
  getGithubRepos,
  fetchGithubCommits,
  showReposReadme,
  fetchReposReadme,
  setShowLanguage,
  choseRepos,
  setChosedRepos,
  setShowedReposId,
  closeReposReadme
}

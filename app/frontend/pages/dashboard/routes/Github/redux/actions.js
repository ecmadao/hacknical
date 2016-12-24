import { createAction, createActions } from 'redux-actions';
import objectAssign from 'object-assign';
import Api from 'API/index';

import CHOSED_REPOS from 'MOCK/chosed_repos';

const {
  toggleModal,
  toggleLoading,
  setGithubInfo,
  setGithubRepos,
  closeReposReadme,
  setShowLanguage,
  setShowedReposId,
  setChosedRepos
} = createActions(
  'TOGGLE_MODAL',
  'TOGGLE_LOADING',
  'SET_GITHUB_INFO',
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
  Api.github.getCommits();
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
  getGithubRepos,
  showReposReadme,
  fetchReposReadme,
  setShowLanguage,
  choseRepos,
  setChosedRepos,
  setShowedReposId,
  closeReposReadme
}

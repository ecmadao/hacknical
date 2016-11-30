import { createAction } from 'redux-actions';
import objectAssign from 'object-assign';
import USER from 'MOCK/user';
import {
  ALL_REPOS,
  REPOS_README
} from 'MOCK/repos';
import CHOSED_REPOS from 'MOCK/chosed_repos';

const toggleLoading = createAction('TOGGLE_LOADING');

const setGithubInfo = createAction('SET_GITHUB_INFO');

const getGithubInfo = () => (dispatch, getState) => {
  dispatch(setGithubInfo(USER));
  dispatch(toggleLoading(false));
};

const setGithubRepos = createAction('SET_GITHUB_REPOS');

const getGithubRepos = () => (dispatch, getState) => {
  dispatch(setGithubRepos(ALL_REPOS));
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

const setShowLanguage = createAction('SET_SHOW_LANGUAGE');

const choseRepos = () => (dispatch, getState) => {
  dispatch(setChosedRepos(CHOSED_REPOS));
};

const setChosedRepos = createAction('SET_CHOSED_REPOS');

const setShowedReposId = createAction('SET_SHOWED_REPOS_ID');

export default {
  setGithubInfo,
  getGithubInfo,
  toggleLoading,
  setGithubRepos,
  getGithubRepos,
  showReposReadme,
  fetchReposReadme,
  setShowLanguage,
  choseRepos,
  setChosedRepos,
  setShowedReposId
}

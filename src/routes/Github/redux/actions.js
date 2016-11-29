import { createAction } from 'redux-actions';
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

const setReposReadme = createAction('SET_REPOS_README');

const getReposReadme = () => (dispatch, getState) => {
  dispatch(setReposReadme(REPOS_README));
};

const setShowLanguage = createAction('SET_SHOW_LANGUAGE');

const choseRepos = () => (dispatch, getState) => {
  dispatch(setChosedRepos(CHOSED_REPOS));
};

const setChosedRepos = createAction('SET_CHOSED_REPOS');

export default {
  setGithubInfo,
  getGithubInfo,
  toggleLoading,
  setGithubRepos,
  getGithubRepos,
  setReposReadme,
  getReposReadme,
  setShowLanguage,
  choseRepos,
  setChosedRepos
}

import { createAction } from 'redux-actions';
import USER from 'MOCK/user';
import {
  ALL_REPOS,
  REPOS_README
} from 'MOCK/repos';

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

export default {
  setGithubInfo,
  getGithubInfo,
  toggleLoading,
  setGithubRepos,
  getGithubRepos,
  setReposReadme,
  getReposReadme
}

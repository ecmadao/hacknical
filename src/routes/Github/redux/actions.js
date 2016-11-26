import { createAction } from 'redux-actions';
import USER from 'MOCK/user';

const setGithubInfo = createAction('SET_GITHUB_INFO');

const toggleLoading = createAction('TOGGLE_LOADING');

const getGithubInfo = () => (dispatch, getState) => {
  dispatch(setGithubInfo(USER));
  dispatch(toggleLoading(false));
};

export default {
  setGithubInfo,
  getGithubInfo,
  toggleLoading
}

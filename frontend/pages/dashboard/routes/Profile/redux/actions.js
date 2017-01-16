import { createAction, createActions } from 'redux-actions';
import objectAssign from 'object-assign';
import Api from 'API/index';

const {
  toggleLoading,
  toggleShareStatus,
  initialGithubShareData
} = createActions(
  'TOGGLE_LOADING',
  'TOGGLE_SHARE_STATUS',
  'INITIAL_GITHUB_SHARE_DATA'
);

const fetchGithubShareData = () => (dispatch, getState) => {
  Api.github.getShareData().then((result) => {
    console.log(result);
    dispatch(initialGithubShareData(result));
  });
};

export default {
  toggleLoading,
  toggleShareStatus,
  initialGithubShareData,
  fetchGithubShareData
}

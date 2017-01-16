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
    console.log(result)
    dispatch(initialGithubShareData(result));
  });
};

const postShareStatus = () => (dispatch, getState) => {
  const { userInfo } = getState().profile;
  const { openShare } = userInfo;
  Api.github.toggleShare(!openShare).then((result) => {
    dispatch(toggleShareStatus(!openShare));
  });
}

export default {
  toggleLoading,
  toggleShareStatus,
  postShareStatus,
  initialGithubShareData,
  fetchGithubShareData
}

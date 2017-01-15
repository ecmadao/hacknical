import { createAction, createActions } from 'redux-actions';
import objectAssign from 'object-assign';
import Api from 'API/index';

const {
  initialGithubShareData
} = createActions(
  'INITIAL_GITHUB_SHARE_DATA'
);

const fetchGithubShareData = () => (dispatch, getState) => {
  Api.github.getShareData().then((result) => {
    console.log(result);
    dispatch(initialGithubShareData(result));
  });
};

export default {
  initialGithubShareData,
  fetchGithubShareData
}

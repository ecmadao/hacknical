import { createAction, createActions } from 'redux-actions';
import objectAssign from 'object-assign';
import Api from 'API/index';

const {
  toggleSettingLoading,
  setUpdateTime
} = createActions(
  'TOGGLE_SETTING_LOADING',
  'SET_UPDATE_TIME'
);

const fetchGithubUpdateTime = () => (dispatch, getState) => {
  Api.github.getUpdateTime().then((result) => {
    dispatch(setUpdateTime(result));
  });
};

export default {
  toggleSettingLoading,
  setUpdateTime,
  fetchGithubUpdateTime
}

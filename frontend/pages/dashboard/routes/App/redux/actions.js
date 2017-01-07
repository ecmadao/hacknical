import { createAction } from 'redux-actions';

const loginUser = createAction('LOGIN_USER');

const logoutUser = createAction('LOGOUT_USER', () => null);

const toggleLoading = createAction('TOGGLE_LOADING');

const toggleTabBar = createAction('TOGGLE_TABBAR');

const changeActiveTab = createAction('CHANGE_ACTIVE_TAB');

const changeTab = (tab) => (dispatch, getState) => {
  dispatch(changeActiveTab(tab));
};

export default {
  loginUser,
  logoutUser,
  toggleLoading,
  toggleTabBar,
  changeActiveTab,
  changeTab
}

import { createAction } from 'redux-actions';
import { push } from 'react-router-redux'

const loginUser = createAction('LOGIN_USER', user => user);

const logoutUser = createAction('LOGOUT_USER', () => null);

const toggleLoading = createAction('TOGGLE_LOADING', (status) => status);

const toggleTabBar = createAction('TOGGLE_TABBAR', (status) => status);

const changeActiveTab = createAction('CHANGE_ACTIVE_TAB');

const changeTab = (tab) => (dispatch, getState) => {
  dispatch(push(tab))
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

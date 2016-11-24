import { createAction } from 'redux-actions';

const loginUser = createAction('LOGIN_USER', user => user);

const logoutUser = createAction('LOGOUT_USER', () => null);

const toggleLoading = createAction('TOGGLE_LOADING', (status) => status);

const toggleTabBar = createAction('TOGGLE_TABBAR', (status) => status);

const changeActiveTab = createAction('CHANGE_ACTIVE_TAB', (tab) => tab);

export default {
  loginUser,
  logoutUser,
  toggleLoading,
  toggleTabBar,
  changeActiveTab
}

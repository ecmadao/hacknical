import { createActions } from 'redux-actions';

const {
  logoutUser,
  loginUser,
  toggleLoading,
  toggleTabBar,
  changeActiveTab
} = createActions({
  'LOGOUT_USER': () => null
},
  'LOGIN_USER',
  'TOGGLE_LOADING',
  'TOGGLE_TABBAR',
  'CHANGE_ACTIVE_TAB'
);

// const loginUser = createAction('LOGIN_USER');
// const logoutUser = createAction('LOGOUT_USER', () => null);
// const toggleLoading = createAction('TOGGLE_LOADING');
// const toggleTabBar = createAction('TOGGLE_TABBAR');
// const changeActiveTab = createAction('CHANGE_ACTIVE_TAB');

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

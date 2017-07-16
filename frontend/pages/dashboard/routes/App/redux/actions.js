import { createActions } from 'redux-actions';

const {
  logoutUser,
  loginUser,
  toggleLoading,
  toggleTabBar,
  changeActiveTab
} = createActions({
  LOGOUT_USER: () => null
},
  'LOGIN_USER',
  'TOGGLE_LOADING',
  'TOGGLE_TABBAR',
  'CHANGE_ACTIVE_TAB'
);

const changeTab = tab => (dispatch) => {
  dispatch(changeActiveTab(tab));
};

export default {
  loginUser,
  logoutUser,
  toggleLoading,
  toggleTabBar,
  changeActiveTab,
  changeTab
};

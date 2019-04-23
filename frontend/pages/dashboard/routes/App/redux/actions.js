
import { createActions } from 'redux-actions'

const {
  logout,
  login,
  toggleLoading,
  toggleTabBar,
  changeActiveTab
} = createActions({
  LOGOUT: () => null,
  LOGIN: () => window.login,
}, 'TOGGLE_LOADING', 'TOGGLE_TABBAR', 'CHANGE_ACTIVE_TAB')

const changeTab = tab => (dispatch) => {
  dispatch(changeActiveTab(tab))
}

export default {
  login,
  logout,
  toggleLoading,
  toggleTabBar,
  changeActiveTab,
  changeTab
}

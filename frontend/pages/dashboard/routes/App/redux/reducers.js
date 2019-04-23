import { handleActions } from 'redux-actions'
import objectAssign from 'UTILS/object-assign'

const initialState = {
  loading: true,
  login: null,
  tabBarActive: true,
  activeTab: 'visualize',
  isMobile: false,
  isAdmin: false,
}

const initReducers = (options = {}) => {
  const reducers = handleActions({
    LOGIN(state, action) {
      return ({
        ...state,
        login: action.payload
      })
    },

    LOGOUT(state) {
      return ({
        ...state,
        login: null
      })
    },

    TOGGLE_LOADING(state, action) {
      return ({
        ...state,
        loading: action.payload
      })
    },

    TOGGLE_TABBAR(state, action) {
      return ({
        ...state,
        tabBarActive: action.payload
      })
    },

    CHANGE_ACTIVE_TAB(state, action) {
      return ({
        ...state,
        activeTab: action.payload
      })
    }
  }, objectAssign({}, initialState, options))
  return reducers
}

export default initReducers

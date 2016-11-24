import { handleActions } from 'redux-actions';

const initialState = {
  loading: true,
  user: null,
  tabBarActive: true,
  activeTab: 'profile'
};

const reducers = handleActions({
  LOGIN_USER(state, action) {
    return ({
      ...state,
      user: action.payload
    });
  },

  LOGOUT_USER(state, action) {
    return ({
      ...state,
      user: null
    });
  },

  TOGGLE_LOADING(state, action) {
    return ({
      ...state,
      loading: action.payload
    });
  },

  TOGGLE_TABBAR(state, action) {
    return ({
      ...state,
      tabBarActive: action.payload
    });
  },

  CHANGE_ACTIVE_TAB(state, action) {
    return ({
      ...state,
      activeTab: action.payload
    })
  }
}, initialState);

export default reducers;

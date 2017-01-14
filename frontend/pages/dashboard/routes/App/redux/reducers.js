import { handleActions } from 'redux-actions';

const initialState = {
  loading: true,
  userId: null,
  tabBarActive: true,
  activeTab: 'github'
};

const reducers = handleActions({
  LOGIN_USER(state, action) {
    return ({
      ...state,
      userId: action.payload
    });
  },

  LOGOUT_USER(state, action) {
    return ({
      ...state,
      userId: null
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

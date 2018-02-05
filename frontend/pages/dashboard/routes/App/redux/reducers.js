import { handleActions } from 'redux-actions';

const initialState = {
  loading: true,
  login: null,
  tabBarActive: true,
  activeTab: 'visualize'
};

const reducers = handleActions({
  LOGIN(state, action) {
    return ({
      ...state,
      login: action.payload
    });
  },

  LOGOUT(state) {
    return ({
      ...state,
      login: null
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

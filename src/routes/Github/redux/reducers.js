import { handleActions } from 'redux-actions';

const initialState = {
  loading: true,
  user: null
};

const reducers = handleActions({
  SET_GITHUB_INFO(state, action) {
    return ({
      ...state,
      user: action.payload
    });
  },
  TOGGLE_LOADING(state, action) {
    return ({
      ...state,
      loading: action.payload
    });
  }
}, initialState);

export default reducers;

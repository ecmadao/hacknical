import { handleActions } from 'redux-actions';

const initialState = {
  loading: true,
  user: null,
  repos: [],
  reposReadme: null
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
  },
  SET_GITHUB_REPOS(state, action) {
    return ({
      ...state,
      repos: action.payload
    });
  },
  SET_REPOS_README(state, action) {
    return ({
      ...state,
      reposReadme: action.payload
    });
  }
}, initialState);

export default reducers;

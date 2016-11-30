import { handleActions } from 'redux-actions';

const initialState = {
  loading: true,
  user: null,
  repos: [],
  chosedRepos: [],
  showedReposId: null,
  showLanguage: null
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
      repos: [...action.payload]
    });
  },
  SET_SHOW_LANGUAGE(state, action) {
    return ({
      ...state,
      showLanguage: action.payload
    });
  },
  SET_CHOSED_REPOS(state, action) {
    return ({
      ...state,
      chosedRepos: [...action.payload]
    });
  },
  SET_SHOWED_REPOS_ID(state, action) {
    return ({
      ...state,
      showedReposId: action.payload
    });
  }
}, initialState);

export default reducers;

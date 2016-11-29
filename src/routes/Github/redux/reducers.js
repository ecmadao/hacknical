import { handleActions } from 'redux-actions';

const initialState = {
  loading: true,
  user: null,
  repos: [],
  chosedRepos: [],
  reposReadme: null,
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
  SET_REPOS_README(state, action) {
    return ({
      ...state,
      reposReadme: action.payload
    });
  },
  SET_SHOW_LANGUAGE(state, action) {
    return ({
      ...state,
      showLanguage: action.payload
    });
  },
  SET_CHOSED_REPOS(state, action) {
    console.log('===== action =====');
    console.log(action)
    return ({
      ...state,
      chosedRepos: [...action.payload]
    });
  }
}, initialState);

export default reducers;

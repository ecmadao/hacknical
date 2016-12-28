import { handleActions } from 'redux-actions';
import objectAssign from 'object-assign';
import USER from 'MOCK/user';
import github from 'UTILS/github';

const initialState = {
  loading: true,
  openModal: false,
  openShareModal: false,
  user: objectAssign({}, USER),
  repos: [],
  reposLanguages: [],
  chosedRepos: [],
  showedReposId: null,
  showLanguage: null,
  commitDatas: [],
  sections: [
    {
      id: 'commitsPreview',
      show: true
    },
    {
      id: 'userPreview',
      show: true
    },
    {
      id: 'reposPreview',
      show: true
    },
    {
      id: 'reposShow',
      show: true
    }
  ]
};

const reducers = handleActions({
  SET_GITHUB_INFO(state, action) {
    return ({
      ...state,
      user: action.payload
    });
  },
  TOGGLE_MODAL(state, action) {
    return ({
      ...state,
      openModal: action.payload
    });
  },
  TOGGLE_SHARE_MODAL(state, action) {
    return ({
      ...state,
      openShareModal: action.payload
    });
  },
  TOGGLE_LOADING(state, action) {
    return ({
      ...state,
      loading: action.payload
    });
  },
  SET_GITHUB_COMMITS(state, action) {
    return ({
      ...state,
      commitDatas: action.payload
    });
  },
  SET_GITHUB_REPOS(state, action) {
    const repos = action.payload;
    return ({
      ...state,
      repos: [...repos],
      reposLanguages: [...github.getReposLanguages(repos)]
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
  CLOSE_REPOS_README(state, action) {
    return ({
      ...state,
      showedReposId: null
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

import { handleActions } from 'redux-actions';
import objectAssign from 'object-assign';
import { getValidateViewSources } from 'UTILS/analysis';

const initialState = {
  resume: {
    loading: true,
    info: {
      url: '',
      openShare: false
    },
    viewDevices: [],
    viewSources: [],
    pageViews: []
  },
  github: {
    loading: true,
    info: {
      url: '',
      openShare: false
    },
    viewDevices: [],
    viewSources: [],
    pageViews: []
  }
};


const reducers = handleActions({
  // github
  TOGGLE_GITHUB_LOADING(state, action) {
    const { github } = state;
    return ({
      ...state,
      github: objectAssign({}, github, { loading: action.payload })
    });
  },

  INITIAL_GITHUB_SHARE_DATA(state, action) {
    const { github } = state;
    const {
      url,
      openShare,
      viewDevices,
      viewSources,
      pageViews
    } = action.payload;
    const newGithub = {
      loading: false,
      info: objectAssign({}, github.info, { url, openShare }),
      viewDevices: [...viewDevices],
      viewSources: getValidateViewSources(viewSources),
      pageViews: pageViews.filter(pageView => !isNaN(pageView.count))
    };
    return ({
      ...state,
      github: objectAssign({}, github, newGithub)
    });
  },

  // resume
  TOGGLE_RESUME_LOADING(state, action) {
    const { resume } = state;
    return ({
      ...state,
      resume: objectAssign({}, resume, { loading: action.payload })
    });
  },

  INITIAL_RESUME_SHARE_DATA(state, action) {
    const { resume } = state;
    const {
      url,
      openShare,
      viewDevices,
      viewSources,
      pageViews
    } = action.payload;
    const newResume = {
      loading: false,
      info: objectAssign({}, resume.info, { url, openShare }),
      viewDevices: [...viewDevices],
      viewSources: getValidateViewSources(viewSources),
      pageViews: pageViews.filter(pageView => !isNaN(pageView.count))
    };
    return ({
      ...state,
      resume: objectAssign({}, resume, newResume)
    });
  },
}, initialState);

export default reducers;

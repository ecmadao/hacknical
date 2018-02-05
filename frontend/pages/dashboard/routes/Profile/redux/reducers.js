import { handleActions } from 'redux-actions';
import objectAssign from 'UTILS/object-assign';
import { getValidateViewSources } from 'UTILS/analysis';
import { VIEW_TYPES } from '../shared/data';

const initialState = {
  activeTab: 'resume',
  resume: {
    loading: false,
    fetched: false,
    info: {
      url: '',
      openShare: false
    },
    viewDevices: [],
    viewSources: [],
    pageViews: [],
    viewType: VIEW_TYPES.HOURLY.ID
  },
  github: {
    loading: false,
    fetched: false,
    info: {
      url: '',
      openShare: false
    },
    viewDevices: [],
    viewSources: [],
    pageViews: [],
    viewType: VIEW_TYPES.HOURLY.ID
  }
};


const reducers = handleActions({
  ON_ANALYSIS_DATA_TAB_CHANGE(state, action) {
    return ({
      ...state,
      activeTab: action.payload
    });
  },
  TOGGLE_ANALYSIS_DATA_LOADING(state, action) {
    const { activeTab } = state;
    return ({
      ...state,
      [activeTab]: objectAssign({}, state[activeTab], {
        loading: action.payload
      })
    });
  },

  INITIAL_ANALYSIS_DATA(state, action) {
    const { activeTab } = state;
    const obj = state[activeTab];
    const {
      url,
      openShare,
      viewDevices,
      viewSources,
      pageViews
    } = action.payload;
    return ({
      ...state,
      [activeTab]: objectAssign({}, obj, {
        loading: false,
        fetched: true,
        info: objectAssign({}, obj.info, { url, openShare }),
        viewDevices: [...viewDevices],
        viewSources: getValidateViewSources(viewSources),
        pageViews: pageViews.filter(pageView => !Number.isNaN(pageView.count))
      })
    });
  },

  // github
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
      fetched: true,
      info: objectAssign({}, github.info, { url, openShare }),
      viewDevices: [...viewDevices],
      viewSources: getValidateViewSources(viewSources),
      pageViews: pageViews.filter(pageView => !Number.isNaN(pageView.count))
    };
    return ({
      ...state,
      github: objectAssign({}, github, newGithub)
    });
  },

  // resume
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
      fetched: true,
      info: objectAssign({}, resume.info, { url, openShare }),
      viewDevices: [...viewDevices],
      viewSources: getValidateViewSources(viewSources),
      pageViews: pageViews.filter(pageView => !Number.isNaN(pageView.count))
    };
    return ({
      ...state,
      resume: objectAssign({}, resume, newResume)
    });
  },

  ON_PAGE_VIEW_TYPE_CHANGE(state, action) {
    const { activeTab } = state;
    const obj = state[activeTab];
    return ({
      ...state,
      [activeTab]: objectAssign({}, obj, {
        viewType: action.payload
      })
    });
  },
}, initialState);

export default reducers;

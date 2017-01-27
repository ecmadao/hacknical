import { handleActions } from 'redux-actions';
import objectAssign from 'object-assign';
import dateHelper from 'UTILS/date';

const initialState = {
  loading: true,
  updateTime: null
};

const reducers = handleActions({
  TOGGLE_SETTING_LOADING(state, action) {
    return ({
      ...state,
      loading: action.payload
    });
  },

  SET_UPDATE_TIME(state, action) {
    return ({
      ...state,
      loading: false,
      updateTime: dateHelper.validator.fullFormat(action.payload)
    });
  }
}, initialState)

export default reducers;

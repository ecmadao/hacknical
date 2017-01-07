import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';

import appReducer from '../reducer/index';

export const createAppStore = (initialState = {}) => {

  // const logger = createLogger();
  const router = routerMiddleware(hashHistory);

  const AppStore = createStore(appReducer, initialState, applyMiddleware(router, thunk));
  // const AppStore = compose(
  //     applyMiddleware(logger)
  //   )(createStore)(appReducer, initialState);

  AppStore.asyncReducers = {};
  return AppStore;
};

export default createAppStore();

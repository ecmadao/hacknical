import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import { hashHistory, browserHistory } from 'react-router';

import appReducer from '../reducer/index';

export const createAppStore = (initialState = {}) => {

  const logger = createLogger();
  const router = routerMiddleware(browserHistory);

  const middlewares = process.env.NODE_ENV === "production"
  ? applyMiddleware(router, thunk)
  : applyMiddleware(router, logger, thunk);

  const AppStore = createStore(appReducer, initialState, middlewares);

  AppStore.asyncReducers = {};
  return AppStore;
};

export default createAppStore();

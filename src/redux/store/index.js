import { createStore, compose, applyMiddleware } from 'redux';
// import promiseMiddleware from 'redux-promise';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';

import appReducer from '../reducer/index';


// const AppStore = createStore(appReducer, applyMiddleware(thunk, router));
// AppStore.asyncReducers = {}

export const createAppStore = (initialState = {}) => {
  const logger = createLogger();
  const router = routerMiddleware(hashHistory);

  const AppStore = compose(
      applyMiddleware(logger)
    )(createStore)(appReducer, initialState);

  AppStore.asyncReducers = {};
  return AppStore;
};

export default createAppStore();

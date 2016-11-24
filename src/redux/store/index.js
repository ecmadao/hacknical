import { createStore, applyMiddleware } from 'redux';
// import promiseMiddleware from 'redux-promise';
import thunk from 'redux-thunk';
// import createLogger from 'redux-logger';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';

import appReducer from '../reducer/index';

// const logger = createLogger();
const router = routerMiddleware(hashHistory);

const AppStore = createStore(appReducer, applyMiddleware(thunk, router));
AppStore.asyncReducers = {}

export default AppStore;

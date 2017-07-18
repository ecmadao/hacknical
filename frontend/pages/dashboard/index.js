import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  browserHistory,
} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import AppContainer from './AppContainer';
import AppStore from './redux/store';
import routes from './routes';

const history = syncHistoryWithStore(browserHistory, AppStore);

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update')
//   whyDidYouUpdate(React);
// }

const renderApp = (id) => {
  const ROOT_DOM = document.getElementById(id);
  ReactDOM.render(
    <AppContainer
      store={AppStore}
      history={history}
      routes={routes(AppStore)}
    />,
    ROOT_DOM
  );
};

export default renderApp;

import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import Github from 'SHAREDPAGE/Github';
import reducers from 'SHAREDPAGE/Github/redux/reducers';

const renderApp = (domId, state = {}) => {
  const githubReducer = {
    github: reducers
  };
  const reducer = combineReducers({
    ...githubReducer
  });
  const store = createStore(
      reducer,
      state,
      applyMiddleware(thunkMiddleware)
  );
  ReactDOM.render(
      <Provider store={store}>
        <Github login={window.login} isShare={window.isShare} />
      </Provider>,
      document.getElementById(domId)
  );
};

export default renderApp;

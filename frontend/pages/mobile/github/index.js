/* eslint global-require: "off" */

import React from 'react';
import ReactDOM from 'react-dom';
import GitHubMobileShare from './container';

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId);
  ReactDOM.render(
    <GitHubMobileShare
      {...props}
    />,
    DOM
  );
};

export default renderApp;

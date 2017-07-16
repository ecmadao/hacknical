/* eslint global-require: "off" */

import React from 'react';
import ReactDOM from 'react-dom';
import GitHubMobileShare from './container';

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update')
  whyDidYouUpdate(React);
}

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId);
  ReactDOM.render(
    <GitHubMobileShare {...props} />,
    DOM
  );
};

export default renderApp;

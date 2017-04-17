import React from 'react';
import ReactDOM from 'react-dom';

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update')
  whyDidYouUpdate(React);
}

import GitHubMobileShare from './container';

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId);
  ReactDOM.render(
    <GitHubMobileShare {...props} />,
    DOM
  );
};

export default renderApp;

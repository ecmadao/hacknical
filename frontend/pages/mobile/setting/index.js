import React from 'react';
import ReactDOM from 'react-dom';

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update')
  whyDidYouUpdate(React);
}

import MobileSetting from './container';

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId);
  ReactDOM.render(
    <MobileSetting {...props} />,
    DOM
  );
};

export default renderApp;

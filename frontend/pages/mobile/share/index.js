import React from 'react';
import ReactDOM from 'react-dom';

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update')
  whyDidYouUpdate(React);
}

import MobileShare from './container';

const renderApp = (domId) => {
  const DOM = document.getElementById(domId);
  ReactDOM.render(
    <MobileShare login={window.login} />,
    DOM
  )
};

export default renderApp;

import React from 'react';
import ReactDOM from 'react-dom';

import Share from './container';

const renderApp = (domId) => {
  const DOM = document.getElementById(domId);
  ReactDOM.render(
    <Share login={window.login} />,
    DOM
  )
};

export default renderApp;

import React from 'react';
import ReactDOM from 'react-dom';

import MobileSetting from './container';

const renderApp = (domId) => {
  const DOM = document.getElementById(domId);
  ReactDOM.render(
    <MobileSetting login={window.login} />,
    DOM
  )
};

export default renderApp;

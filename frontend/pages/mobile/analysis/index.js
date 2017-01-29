import React from 'react';
import ReactDOM from 'react-dom';

import MobileAnalysis from './container';

const renderApp = (domId) => {
  const DOM = document.getElementById(domId);
  ReactDOM.render(
    <MobileAnalysis login={window.login} />,
    DOM
  )
};

export default renderApp;

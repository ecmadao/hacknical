import React from 'react';
import ReactDOM from 'react-dom';

import MobileShare from './container';

const renderApp = (domId) => {
  const DOM = document.getElementById(domId);
  ReactDOM.render(
    <MobileShare login={window.login} />,
    DOM
  )
};

export default renderApp;

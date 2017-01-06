import React from 'react';
import ReactDOM from 'react-dom';

import ShareMobile from './container';

const renderApp = (domId) => {
  const DOM = document.getElementById(domId);
  ReactDOM.render(
    <ShareMobile login={window.login} />,
    DOM
  )
};

export default renderApp;

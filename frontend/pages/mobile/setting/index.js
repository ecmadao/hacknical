/* eslint global-require: "off" */

import React from 'react';
import ReactDOM from 'react-dom';
import MobileSetting from './container';

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId);
  ReactDOM.render(
    <MobileSetting {...props} />,
    DOM
  );
};

export default renderApp;

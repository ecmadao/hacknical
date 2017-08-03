/* eslint global-require: "off" */

import React from 'react';
import ReactDOM from 'react-dom';

import MobileAnalysis from './container';

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId);
  ReactDOM.render(
    <MobileAnalysis {...props} />,
    DOM
  );
};

export default renderApp;

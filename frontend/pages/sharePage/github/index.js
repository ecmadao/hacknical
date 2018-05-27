/* eslint global-require: "off" */

import React from 'react';
import ReactDOM from 'react-dom';
import GitHubComponent from 'SHARED/components/GitHubComponent';

const renderApp = (domId, props = {}) => {
  ReactDOM.render(
    <GitHubComponent
      {...props}
    />,
    document.getElementById(domId)
  );
};

export default renderApp;

/* eslint global-require: "off" */

import React from 'react';
import ReactDOM from 'react-dom';

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update')
  whyDidYouUpdate(React);
}

import GithubComponent from 'SHARED/components/GithubComponent';

const renderApp = (domId, props = {}) => {
  ReactDOM.render(
    <GithubComponent
      {...props}
    />,
    document.getElementById(domId)
  );
};

export default renderApp;

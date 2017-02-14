import React from 'react';
import ReactDOM from 'react-dom';

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update')
  whyDidYouUpdate(React);
}

import GithubComponent from 'SHAREDPAGE/components/GithubComponent';

const renderApp = (domId, state = {}) => {
  ReactDOM.render(
      <GithubComponent login={window.login} isShare={window.isShare} />,
      document.getElementById(domId)
  );
};

export default renderApp;

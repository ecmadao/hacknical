import React from 'react';
import ReactDOM from 'react-dom';
import GitHubMobileShare from 'PAGES/mobile/github';
import 'SRC/vendor/mobile/github.css';
import initialHeadroom from 'SRC/vendor/shared/headroom';

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId);
  ReactDOM.render(
    <GitHubMobileShare
      {...props}
    />,
    DOM
  );
};

$(() => {
  renderApp('github', {
    login: window.login,
    isAdmin: window.isAdmin === 'true'
  });

  initialHeadroom('#share_banner');
});

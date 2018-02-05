import React from 'react';
import ReactDOM from 'react-dom';
import ResumeMobileShare from 'PAGES/mobile/resume';

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId);
  ReactDOM.render(
    <ResumeMobileShare {...props} />,
    DOM
  );
};

$(() => {
  renderApp('resume', {
    hash: window.resumeHash,
    login: window.login
  });
});

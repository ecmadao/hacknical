import renderApp from 'PAGES/resume/share';

$(() => {
  renderApp('share_body', {
    hash: window.resumeHash
  });
});

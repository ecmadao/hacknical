import renderApp from 'PAGES/mobile/resume';

$(() => {
  renderApp('resume', {
    hash: window.resumeHash,
    login: window.login
  });
});

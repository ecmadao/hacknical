import 'SRC/vendor/shared/loading.css';
import renderApp from 'PAGES/sharePage/resume';

$(() => {
  renderApp('resume', {
    hash: window.resumeHash,
    login: window.login
  });
});

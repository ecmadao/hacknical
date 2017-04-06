import 'SRC/vendor/shared/loading.css';
import renderApp from 'PAGES/sharePage/resume';

$(() => {
  renderApp('share_body', {
    hash: window.resumeHash,
    login: window.login
  });
});

import renderApp from 'PAGES/mobile/share';
import 'SRC/vendor/share/share_mobile.css';

$(() => {
  renderApp('share_body', {
    login: window.login
  });
});

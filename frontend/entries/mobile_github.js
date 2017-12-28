import renderApp from 'PAGES/mobile/github';
import 'SRC/vendor/mobile/github.css';
import initialHeadroom from 'SRC/vendor/shared/headroom';

$(() => {
  renderApp('github', {
    login: window.login,
    isAdmin: window.isAdmin === 'true'
  });

  initialHeadroom('#share_banner');
});

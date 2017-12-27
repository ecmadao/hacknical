import renderApp from 'PAGES/mobile/github';
import 'SRC/vendor/mobile/github.css';
import initialHeadroom from 'SRC/vendor/shared/headroom';

$(() => {
  renderApp('github', {
    login: window.login,
    isAdmin: Boolean(window.isAdmin)
  });

  initialHeadroom('#share_banner');
});

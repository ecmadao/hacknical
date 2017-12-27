import renderApp from 'PAGES/sharePage/github';
import 'SRC/vendor/share/share.css';
import initialHeadroom from 'SRC/vendor/shared/headroom';

$(() => {
  renderApp('share', {
    login: window.login,
    isShare: window.isShare
  });
  initialHeadroom('#share_banner');
});

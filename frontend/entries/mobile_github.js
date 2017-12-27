import renderApp from 'PAGES/mobile/github';
import 'SRC/vendor/mobile/github.css';
import initialBanner from 'SRC/vendor/shared/footer_banner';

$(() => {
  renderApp('github', {
    login: window.login,
    isAdmin: Boolean(window.isAdmin)
  });

  const $shareBanner = $('#share_banner')[0];
  initialBanner($shareBanner);
});

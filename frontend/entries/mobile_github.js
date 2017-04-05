import renderApp from 'PAGES/mobile/github';
import 'SRC/vendor/mobile/github.css';
import initialBanner from 'SRC/vendor/shared/footer_banner';

$(() => {
  renderApp('share_body', {
    login: window.login
  });

  const $shareBanner = $('#share_banner')[0];
  initialBanner($shareBanner);
});

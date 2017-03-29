import renderApp from 'PAGES/mobile/share';
import 'SRC/vendor/share/share_mobile.css';
import initialBanner from 'SRC/vendor/shared/footer_banner';

$(() => {
  renderApp('share_body', {
    login: window.login
  });

  const $shareBanner = $('#share_banner')[0];
  initialBanner($shareBanner);
});

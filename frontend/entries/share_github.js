import renderApp from 'PAGES/sharePage/github';
import 'SRC/vendor/share/share.css';
import initialBanner from 'SRC/vendor/shared/footer_banner';

$(() => {
  renderApp('share');
  const $shareBanner = $('#share_banner')[0];
  initialBanner($shareBanner);
});

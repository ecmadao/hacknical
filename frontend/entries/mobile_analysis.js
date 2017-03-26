import 'STYLES/fonts-login.css';
import renderApp from 'PAGES/mobile/analysis';

$(() => {
  renderApp('analysis', {
    login: window.login
  });
});

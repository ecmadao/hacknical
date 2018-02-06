import renderApp from 'PAGES/dashboard';
import 'SRC/vendor/dashboard/dashboard.css';
import Api from 'API';

const renderOctocat = () => {
  Api.github.octocat().then(octocat => console.log(octocat))
};

$(() => {
  renderApp('root', {
    login: window.login,
    locale: window.locale,
    isAdmin: window.isAdmin === 'true',
    isMobile: window.isMobile === 'true',
  });
  renderOctocat();
});

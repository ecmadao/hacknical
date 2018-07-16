import renderApp from 'PAGES/dashboard';
import 'SRC/vendor/dashboard/dashboard.css';
import Api from 'API';

const renderOctocat = () =>
  Api.github.octocat().then(console.log);

$(() => {
  renderApp('root', {
    login: window.login,
    isAdmin: window.isAdmin === 'true',
    isMobile: window.isMobile === 'true',
    dashboardRoute: window.dashboardRoute || 'visualize',
  });
  renderOctocat();
});

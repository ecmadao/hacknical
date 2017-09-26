import renderApp from 'PAGES/dashboard';
import 'SRC/vendor/dashboard/dashboard.css';
import Api from 'API';

const renderOctocat = async () => {
  const octocat = await Api.github.octocat();
  console.log(octocat);
};

$(() => {
  renderApp('root');
  renderOctocat();
});

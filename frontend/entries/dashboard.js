import renderApp from 'PAGES/dashboard/index';
import 'SRC/vendor/dashboard/dashboard.css';
// import 'PAGES/dashboard/style/github_readme.css';
import Api from 'API';

const renderOctocat = async () => {
  const octocat = await Api.github.octocat();
  console.log(octocat);
};

$(() => {
  renderApp('root');
  renderOctocat();
});

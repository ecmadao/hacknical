import initOpbeat from 'opbeat-react';
import renderApp from 'PAGES/dashboard';
import 'SRC/vendor/dashboard/dashboard.css';
import Api from 'API';

const renderOctocat = async () => {
  const octocat = await Api.github.octocat();
  console.log(octocat);
};

$(() => {
  initOpbeat({
    orgId: 'ea3776fa17c44d5b8d8de26870279506',
    appId: '11b2f81d96'
  });
  renderApp('root');
  renderOctocat();
});

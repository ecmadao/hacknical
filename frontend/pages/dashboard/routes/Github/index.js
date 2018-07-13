
import asyncComponent from 'COMPONENTS/AsyncComponent';

const githubComponent = {
  desktop: asyncComponent(
    () => System.import('SHARED/components/GitHubComponent')
      .then(component => component.default)
  ),
  mobile: asyncComponent(
    () => System.import('SHARED/components/GitHubMobileComponent')
      .then(component => component.default)
  ),
};

export default (store, options) => {
  const { login, device } = options;
  const GithubComponent = githubComponent[device];
  return {
    path: `/${login}/visualize`,
    component: GithubComponent,
  };
};

import asyncComponent from 'COMPONENTS/AsyncComponent';

export default asyncComponent(
  () => System.import('SHARED/components/GitHubComponent')
  .then(component => component.default)
);

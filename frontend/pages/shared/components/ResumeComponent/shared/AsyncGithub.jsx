import asyncComponent from '../../AsyncComponent';

export default asyncComponent(
  () => System.import('SHARED/components/GitHubComponent')
  .then(component => component.default)
);

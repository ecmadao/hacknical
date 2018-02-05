import asyncComponent from '../../AsyncComponent';

export default asyncComponent(
  () => System.import('SHARED/components/GithubComponent')
  .then(component => component.default)
);

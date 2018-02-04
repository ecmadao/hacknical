import PATH from '../shared/path';
import asyncComponent from 'SHARED/components/AsyncComponent';

export default () => ({
  path: `${PATH.RAW_PATH}/github`,
  component: asyncComponent(
    () => System.import('SHARED/components/GithubComponent')
      .then(component => component.default)
  )
});

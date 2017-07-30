import PATH from '../shared/path';

export default () => ({
  path: `${PATH.RAW_PATH}/github`,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('SHARED/components/GithubComponent').default);
    });
  }
});

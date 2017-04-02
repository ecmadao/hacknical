import PATH from '../shared/path';

export default store => ({
  path: `${PATH.BASE_PATH}/github`,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('SHARED/components/GithubComponent').default)
    });
  }
})

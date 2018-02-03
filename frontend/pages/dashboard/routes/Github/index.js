import PATH from '../shared/path';

export default () => ({
  path: `${PATH.RAW_PATH}/github`,
  getComponent(nextState, cb) {
    System.import('SHARED/components/GithubComponent')
      .then((component) => {
        cb(null, component.default);
      });
  }
});

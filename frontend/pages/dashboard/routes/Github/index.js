import PATH from '../shared/path';
/* eslint-disable no-unused-vars */
import _ from 'SHARED/components/GithubComponent';

export default () => ({
  path: `${PATH.RAW_PATH}/github`,
  getComponent(nextState, cb) {
    System.import('SHARED/components/GithubComponent')
      .then((component) => {
        cb(null, component.default);
      });
  }
});

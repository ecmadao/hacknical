import { injectReducer } from '../../redux/reducer/index';
import reducer from 'SHAREDPAGE/components/GithubComponent/redux/reducers';
import PATH from '../shared/path';


export default store => ({
  path: `${PATH.BASE_PATH}/github`,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'github', reducer });
      cb(null, require('SHAREDPAGE/components/GithubComponent').default)
    });
  }
})

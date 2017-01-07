import { injectReducer } from '../../redux/reducer/index';
import reducer from 'SHAREDPAGE/Github/redux/reducers';

export default store => ({
  path: 'github',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'github', reducer });
      cb(null, require('SHAREDPAGE/Github').default)
    });
  }
})

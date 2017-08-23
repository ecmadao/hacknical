import { injectReducer } from '../../redux/reducer';
import reducer from './redux/reducers';
import PATH from '../shared/path';

export default store => ({
  path: `${PATH.RAW_PATH}/profile`,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'profile', reducer });
      cb(null, require('./Components/index').default)
    });
  }
});

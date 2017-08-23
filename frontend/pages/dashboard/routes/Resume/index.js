import { injectReducer } from '../../redux/reducer';
import reducer from './redux/reducers';
import PATH from '../shared/path';

export default store => ({
  path: `${PATH.RAW_PATH}/resume`,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'resume', reducer });
      cb(null, require('./Components/index').default)
    });
  }
});

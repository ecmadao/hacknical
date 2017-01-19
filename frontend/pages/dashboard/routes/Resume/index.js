import { injectReducer } from '../../redux/reducer/index';
import reducer from './redux/reducers';
import PATH from '../shared/path';

export default store => ({
  path: `${PATH.BASE_PATH}/resume`,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'resume', reducer });
      cb(null, require('./Components/index').default)
    });
  }
})

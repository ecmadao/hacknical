import { injectReducer } from '../../redux/reducer';
import reducer from './redux/reducers';
import PATH from '../shared/path';

export default store => ({
  path: `${PATH.RAW_PATH}/profile`,
  getComponent(nextState, cb) {
    System.import('./Components/index')
      .then((component) => {
        injectReducer(store, { key: 'profile', reducer });
        cb(null, component.default);
      });
  }
});

import { injectReducer } from '../../redux/reducer/index';
import reducer from './redux/reducers';

export default store => ({
  path: 'profile',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'profile', reducer });
      cb(null, require('./Components/index').default)
    });
  }
})

import { injectReducer } from '../../redux/reducer/index';
import reducer from './redux/reducers';

export default store => ({
  path: 'resume',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'resume', reducer });
      cb(null, require('./Components/index').default)
    });
  }
})

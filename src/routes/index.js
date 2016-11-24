import {injectReducer} from '../redux/reducer/index';
import reducers from './App/redux/reducers';
import App from './App/index';

const createRoutes = (store) => {
  injectReducer(store, { key: 'app', reducers });
  return {
    component: App,
    childRoutes: [
      {
        path: '/',
        // onEnter: (nextState, replace) => {
        //   replace('/weathers/now');
        // }
      }
    ]
  }
}

export default createRoutes;

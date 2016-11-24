import { injectReducer } from '../redux/reducer/index';
import reducer from './App/redux/reducers';
import App from './App/index';

export const createRoutes = (store) => {
  injectReducer(store, { key: 'app', reducer });
  console.log('=== reducers === reducers ===')
  console.log(reducer);

  return {
    path: '/',
    component: App,
    // childRoutes: [
    //   {
    //     path: '/',
    //     onEnter: (nextState, replace) => {
    //       replace('/weathers/now');
    //     }
    //   }
    // ]
  }
}

export default createRoutes;

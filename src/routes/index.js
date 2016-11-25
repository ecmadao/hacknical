import { injectReducer } from '../redux/reducer/index';
import reducer from './App/redux/reducers';
import App from './App/index';

export const createRoutes = (store) => {
  injectReducer(store, { key: 'app', reducer });

  return {
    path: '/',
    component: App,
    childRoutes: [
      require('./Profile/index').default,
      require('./Resume/index').default,
      require('./Github/index').default,
      require('./Setting/index').default,
      {
        path: '/',
        onEnter: (nextState, replace) => {
          replace('/profile');
        }
      }
    ]
  }
}

export default createRoutes;

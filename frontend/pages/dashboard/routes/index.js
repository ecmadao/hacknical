import { injectReducer } from '../redux/reducer/index';
import reducer from './App/redux/reducers';
import App from './App/index';
import Github from './Github/index';
import Profile from './Profile/index';
import Resume from './Resume/index';
// import Setting from './Setting/index';

export const createRoutes = (store) => {
  injectReducer(store, { key: 'app', reducer });

  return {
    component: App,
    childRoutes: [
      Profile(store),
      Resume(store),
      Github(store),
      // Setting(store),
      {
        path: '/',
        onEnter: (nextState, replace) => {
          replace('/github');
        }
      }
    ]
  }
}

export default createRoutes;

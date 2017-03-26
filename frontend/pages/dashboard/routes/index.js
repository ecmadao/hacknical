import { injectReducer } from '../redux/reducer/index';
import reducer from './App/redux/reducers';
import App from './App/index';
import Github from './Github/index';
import Profile from './Profile/index';
import Resume from './Resume/index';
import Setting from './Setting/index';
import PATH from './shared/path';

export const createRoutes = (store) => {
  injectReducer(store, { key: 'app', reducer });

  return {
    component: App,
    childRoutes: [
      Profile(store),
      Resume(store),
      Github(store),
      Setting(store),
      {
        path: `${PATH.RAW_PATH}/`,
        onEnter: (nextState, replace) => {
          replace('github');
        }
      },
      {
        path: PATH.RAW_PATH,
        onEnter: (nextState, replace) => {
          replace(`${PATH.RAW_PATH}/`);
        }
      },
    ]
  }
}

export default createRoutes;

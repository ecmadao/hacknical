/* eslint new-cap: "off" */
import { injectReducer } from '../redux/reducer';
import reducer from './App/redux/reducers';
import App from './App';
import Github from './Github';
import Profile from './Profile';
import Resume from './Resume';
import Setting from './Setting';
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
          replace(`${PATH.RAW_PATH}/github`);
        }
      },
      {
        path: PATH.RAW_PATH,
        onEnter: (nextState, replace) => {
          replace(`${PATH.RAW_PATH}/github`);
        }
      },
    ]
  }
}

export default createRoutes;

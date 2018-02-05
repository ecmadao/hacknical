/* eslint new-cap: "off" */
import { injectReducer } from '../redux/reducer';
import reducer from './App/redux/reducers';
import App from './App';
import Github from './Github';
import Profile from './Profile';
import Resume from './Resume';
import Setting from './Setting';

export const createRoutes = (store) => {
  injectReducer(store, { key: 'app', reducer });

  return [{
    component: App,
    routes: [
      Profile(store),
      Resume(store),
      Github(store),
      Setting(store),
    ]
  }];
};

export default createRoutes;

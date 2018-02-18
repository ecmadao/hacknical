/* eslint new-cap: "off" */
import { injectReducer } from '../redux/reducer';
import initReducers from './App/redux/reducers';
import App from './App';
import Github from './Github';
import Profile from './Profile';
import Resume from './Resume';
import Setting from './Setting';

export const createRoutes = (store, props) => {
  const {
    login,
    dashboardRoute,
    locale = 'en',
    isAdmin = false,
    isMobile = false,
  } = props;
  injectReducer(store, {
    key: 'app',
    reducer: initReducers({
      login,
      locale,
      isAdmin,
      isMobile,
      activeTab: dashboardRoute,
    })
  });
  const device = isMobile ? 'mobile' : 'desktop';
  const options = {
    login,
    device,
    isMobile,
    dashboardRoute,
  };
  return [{
    component: App,
    routes: [
      Profile(store, options),
      Resume(store, options),
      Github(store, options),
      Setting(store, options),
    ]
  }];
};

export default createRoutes;

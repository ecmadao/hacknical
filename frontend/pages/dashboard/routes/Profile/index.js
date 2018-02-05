import { injectReducer } from '../../redux/reducer';
import reducer from './redux/reducers';
import asyncComponent from 'SHARED/components/AsyncComponent';

export default (store, options) => {
  const { login, device } = options;
  const profileComponent = {
    desktop: asyncComponent(
      () => System.import('./Components/Desktop')
        .then((component) => {
          injectReducer(store, { key: 'profile', reducer });
          return component.default;
        })
    ),
    mobile: asyncComponent(
      () => System.import('./Components/Mobile')
        .then(component => component.default)
    ),
  };
  const ProfileComponent = profileComponent[device];
  return {
    path: `/${login}/profile`,
    component: ProfileComponent
  };
};

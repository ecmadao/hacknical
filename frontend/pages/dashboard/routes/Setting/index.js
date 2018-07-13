import { injectReducer } from '../../redux/reducer';
import reducer from './redux/reducers';
import asyncComponent from 'COMPONENTS/AsyncComponent';

export default (store, options) => {
  const { login, device } = options;
  const settingComponent = {
    desktop: asyncComponent(
      () => System.import('./Components/Desktop')
        .then((component) => {
          injectReducer(store, { key: 'setting', reducer });
          return component.default;
        })
    ),
    mobile: asyncComponent(
      () => System.import('./Components/Mobile')
        .then(component => component.default)
    ),
  };
  const SettingComponent = settingComponent[device];
  return {
    path: `/${login}/setting`,
    component: SettingComponent
  };
};

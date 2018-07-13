import { injectReducer } from '../../redux/reducer';
import reducer from './redux/reducers';
import asyncComponent from 'COMPONENTS/AsyncComponent';

export default (store, options) => {
  const { login, device } = options;
  const recordsComponent = {
    desktop: asyncComponent(
      () => System.import('./Components/Desktop')
        .then((component) => {
          injectReducer(store, { key: 'records', reducer });
          return component.default;
        })
    ),
    mobile: asyncComponent(
      () => System.import('./Components/Mobile')
        .then(component => component.default)
    ),
  };
  const RecordsComponent = recordsComponent[device];
  return {
    path: `/${login}/records`,
    component: RecordsComponent
  };
};

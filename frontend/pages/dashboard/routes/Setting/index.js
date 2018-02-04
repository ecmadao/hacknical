import { injectReducer } from '../../redux/reducer';
import PATH from '../shared/path';
import reducer from './redux/reducers';
import asyncComponent from 'SHARED/components/AsyncComponent';

export default store => ({
  path: `${PATH.RAW_PATH}/setting`,
  component: asyncComponent(
    () => System.import('./Components')
      .then((component) => {
        injectReducer(store, { key: 'setting', reducer });
        return component.default;
      })
  )
});

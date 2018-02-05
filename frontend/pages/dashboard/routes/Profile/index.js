import { injectReducer } from '../../redux/reducer';
import reducer from './redux/reducers';
import PATH from '../shared/path';
import asyncComponent from 'SHARED/components/AsyncComponent';

export default store => ({
  path: `${PATH.RAW_PATH}/profile`,
  component: asyncComponent(
    () => System.import('./Components')
      .then((component) => {
        injectReducer(store, { key: 'profile', reducer });
        return component.default;
      })
  )
});

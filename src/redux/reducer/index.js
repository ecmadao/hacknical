import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

// REDUCERS.routing = routerReducer;
// const appReducer = combineReducers(REDUCERS);

export const makeRootReducer = (asyncReducers = {}) => {
  const reducer = combineReducers({
    routing,
    ...asyncReducers,
  });
  return reducer;
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

const appReducer = makeRootReducer();

export default appReducer;

import PATH from '../shared/path';

export default store => ({
  path: `${PATH.BASE_PATH}/setting`,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Components/index').default)
    })
  }
})

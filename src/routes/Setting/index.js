export default {
  path: 'setting',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Components/index').default)
    })
  }
}

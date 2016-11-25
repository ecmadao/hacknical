export default {
  path: 'github',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Components/index').default)
    })
  }
}

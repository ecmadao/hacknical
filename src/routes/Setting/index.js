export default store => ({
  path: 'setting',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Components/index').default)
    })
  }
})

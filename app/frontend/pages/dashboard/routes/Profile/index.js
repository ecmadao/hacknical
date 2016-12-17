export default store => ({
  path: 'profile',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Components/index').default)
    });
  }
})

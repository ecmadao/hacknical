
export const wrapper = (options) => {
  const {
    after = [],
    before = [],
    action = Function.prototype
  } = options

  return (...args) => (dispatch) => {
    for (const func of before) {
      func(dispatch)
    }
    dispatch(action(...args))
    for (const func of after) {
      func(dispatch)
    }
  }
}

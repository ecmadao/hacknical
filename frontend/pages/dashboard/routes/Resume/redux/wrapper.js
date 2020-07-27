
export const wrapper = (options) => {
  const {
    after = [],
    before = [],
    action = Function.prototype
  } = options

  return (...args) => (dispatch, getState) => {
    const { shareInfo = {} } = getState().resume

    for (const func of before) {
      func(dispatch, getState)
    }
    dispatch(action(...args))

    if (!shareInfo.autosave) return

    for (const func of after) {
      func(dispatch, getState)
    }
  }
}

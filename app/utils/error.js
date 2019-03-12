
export const ERRORS = {
  ServerError: 'SERVER_ERROR',
  UnknownError: 'UNKNOWN_ERROR',
  ParamsError: 'PARAMS_ERROR',
  PermissionError: 'PERMISSION_ERROR',
  NotfoundError: 'NOTFOUND_ERROR',
  LoginError: 'LOGIN_ERROR'
}

function createError(errorName) {
  const errorCode = ERRORS[errorName]

  class NewError extends Error {
    constructor(message, signal) {
      if (message instanceof Error) {
        super(message.message)
        this.origin = message
      } else {
        super(message)
      }

      this.signal = signal
      this.errorName = errorName
      this.errorCode = errorCode
    }
  }

  return NewError
}

const attributeHandler = {
  get(_, errorName) {
    if (!ERRORS[errorName]) return Error
    return createError(errorName)
  }
}

function target() {}
export default new Proxy(target, attributeHandler)

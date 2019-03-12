
import NewError from '../../utils/error'
import { SIGNAL } from '../../utils/constant'

const check = (target, params, options) => {
  const {
    signal,
    errorType = 'PermissionError',
    templateMsg = '%s missing!'
  } = options
  for (const param of params) {
    if (!{}.hasOwnProperty.call(target, param)) {
      throw new NewError[errorType](
        templateMsg.replace('%s', param),
        signal
      )
    }
  }
}

const checkQuery = (...params) => async (ctx, next) => {
  check(ctx.query, params, {
    templateMsg: 'required query \'%s\' is missed.'
  })
  await next()
}

const checkBody = (...params) => async (ctx, next) => {
  check(ctx.request.body, params, {
    templateMsg: 'required body \'%s\' is missed.'
  })
  await next()
}

const checkSession = (params = []) => async (ctx, next) => {
  check(ctx.session, params, {
    signal: SIGNAL.NEED_LOGIN,
    errorType: 'LoginError',
    templateMsg: ctx.__('messages.error.logout')
  })
  await next()
}

export default {
  query: checkQuery,
  body: checkBody,
  session: checkSession
}

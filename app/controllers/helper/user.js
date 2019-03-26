
import session from './session'
import { VALIDATE_DASHBOARD } from '../../utils/constant'

const check = (params, sessions) => params.some(key => sessions[key])

const checkNotLogin = () => async (ctx, next) => {
  const checkResult = check(session.requiredSessions, ctx.session)
  if (checkResult) {
    const { githubLogin } = ctx.session
    return ctx.redirect(`/${githubLogin}`)
  }
  await next()
}

const checkIfLogin = (redirect = '/')  => async (ctx, next) => {
  const checkResult = check(session.requiredSessions, ctx.session)
  if (!checkResult) {
    return ctx.redirect(redirect)
  }
  await next()
}

const checkValidateUser = () => async (ctx, next) => {
  const { login } = ctx.params
  const { githubLogin } = ctx.session
  if (!githubLogin) {
    return ctx.redirect('/404')
  } else if (login !== githubLogin) {
    return ctx.redirect(`/${githubLogin}`)
  }
  await next()
}

const checkValidateDashboard = () => async (ctx, next) => {
  const { dashboardRoute } = ctx.params
  const { githubLogin } = ctx.session
  if (!VALIDATE_DASHBOARD.has(dashboardRoute)) return ctx.redirect(`/${githubLogin}`)
  await next()
}

export default {
  checkIfLogin,
  checkNotLogin,
  checkValidateUser,
  checkValidateDashboard
}

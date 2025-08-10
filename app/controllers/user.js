
import network from '../services/network'
import getCacheKey from './helper/cacheKey'
import logger from '../utils/logger'
import notify from '../services/notify'
import { hashPassword, verifyPassword, generateResetToken, validateEmail, validatePassword } from '../utils/password'
import emailService from '../utils/email'

const clearCache = async (ctx, next) => {
  const cacheKey = getCacheKey(ctx)
  ctx.query.deleteKeys = [
    cacheKey('user-repositories', {
      query: ['login']
    }),
    cacheKey('user-contributed', {
      query: ['login']
    }),
    cacheKey('allRepositories', {
      query: ['login']
    }),
    cacheKey('user-github', {
      query: ['login']
    }),
    cacheKey('user-hotmap', {
      query: ['login'],
      session: ['locale']
    }),
    cacheKey('user-organizations', {
      query: ['login'],
    }),
    cacheKey('user-commits', {
      query: ['login'],
    })
  ]
  ctx.body = {
    success: true
  }
  await next()
}

const logout = async (ctx) => {
  ctx.session.userId = null
  ctx.session.githubToken = null
  ctx.session.githubLogin = null

  const { messageCode, messageType } = ctx.request.query

  ctx.redirect(`/?messageCode=${messageCode}&messageType=${messageType}`)
}

const loginByGitHub = async (ctx) => {
  const { code } = ctx.request.query
  try {
    const githubToken = await network.github.getToken(code)
    const userInfo = await network.github.getLogin(githubToken)
    logger.debug(userInfo)

    if (userInfo.login) {
      ctx.session.githubToken = githubToken
      ctx.session.githubLogin = userInfo.login
      ctx.session.githubAvator = userInfo.avator

      const user = await network.user.createUser(userInfo)
      notify.slack({
        mq: ctx.mq,
        data: {
          type: 'login',
          data: `<https://github.com/${userInfo.login}|${userInfo.login}> logined!`
        }
      })

      logger.info(`[USER:LOGIN] ${JSON.stringify(user)}`)
      ctx.session.userId = user.userId
      if (user && user.initialed) {
        network.github.updateUserData(ctx.session.githubLogin, githubToken)
      }

      return ctx.redirect(`/${ctx.session.githubLogin}`)
    }

    return ctx.redirect('/api/user/logout')
  } catch (err) {
    logger.error(err)
    return ctx.redirect('/api/user/logout?messageCode=github&messageType=error')
  }
}

const initialFinished = async (ctx) => {
  const { userId } = ctx.session

  await Promise.all([
    network.user.updateUser(userId, { initialed: true }),
    network.stat.putStat({
      type: 'github',
      action: 'count'
    })
  ])

  ctx.body = {
    success: true,
    result: ''
  }
}

const getGitHubSections = async (ctx) => {
  const { login } = ctx.query
  const user = await network.user.getUser({
    login: login || ctx.session.githubLogin
  })
  const resumeInfo = await network.user.getResumeInfo({ userId: user.userId })

  ctx.body = {
    result: resumeInfo.githubSections,
    success: true
  }
}

const getUserInfo = async (ctx) => {
  const { login } = ctx.query
  const user = await network.user.getUser({
    login: login || ctx.session.githubLogin
  })

  ctx.body = {
    result: user,
    success: true
  }
}

const patchUserInfo = async (ctx) => {
  const { userId } = ctx.session
  const { info } = ctx.request.body

  await network.user.updateUser(userId, info)
  ctx.body = {
    success: true
  }
}

const getUnreadNotifies = async (ctx) => {
  const { userId, locale } = ctx.session

  let datas = []
  try {
    datas = await network.stat.getUnreadNotifies(userId, locale)
  } catch (e) {
    logger.error(e)
  } finally {
    ctx.body = {
      result: datas,
      success: true
    }
  }
}

const markNotifies = async (ctx) => {
  const { userId } = ctx.session
  const { messageIds } = ctx.request.body

  await network.stat.markNotifies(userId, messageIds)
  ctx.body = {
    success: true
  }
}

const voteNotify = async (ctx) => {
  const { userId, githubLogin } = ctx.session
  const { messageId } = ctx.params

  const { vote } = ctx.request.body
  let mark = parseInt(vote, 10)
  if (Number.isNaN(mark)) mark = 0

  const type = mark ? 'Upvote' : 'Downvote'

  notify.slack({
    mq: ctx.mq,
    data: {
      data: `${type.toUpperCase()} ${messageId} by <https://github.com/${githubLogin}|${githubLogin}>`
    }
  })

  await network.stat.voteNotify(userId, {
    messageId,
    vote: mark
  })

  ctx.body = {
    success: true
  }
}

/* ===================== Email Authentication ===================== */

/**
 * 邮箱注册
 */
const registerByEmail = async (ctx) => {
  const { email, password, name } = ctx.request.body

  // 验证邮箱格式
  if (!validateEmail(email)) {
    return ctx.body = {
      success: false,
      message: '邮箱格式不正确'
    }
  }

  // 验证密码强度
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.valid) {
    return ctx.body = {
      success: false,
      message: passwordValidation.errors.join(', ')
    }
  }

  try {
    // 检查邮箱是否已存在
    const existingUser = await network.user.getUserByEmail(email)
    if (existingUser) {
      return ctx.body = {
        success: false,
        message: '该邮箱已被注册'
      }
    }

    // 加密密码
    const hashedPassword = await hashPassword(password)

    // 生成验证token
    const verificationToken = generateResetToken()

    // 创建用户
    const userData = {
      email,
      name: name || email.split('@')[0],
      password: hashedPassword,
      loginType: 'email',
      emailVerified: false,
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + (24 * 60 * 60 * 1000)) // 24小时
    }

    const user = await network.user.createUserByEmail(userData)
    // 发送验证邮件
    const emailSent = await emailService.sendVerificationEmail(email, verificationToken, name)
    if (!emailSent) {
      logger.warn(`[EMAIL] Failed to send verification email to ${email}`)
    }

    logger.info(`[USER:REGISTER] ${email} registered successfully`)
    ctx.body = {
      success: true,
      message: '注册成功！请检查你的邮箱并点击验证链接完成注册。',
      result: {
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified
      }
    }
  } catch (error) {
    logger.error(`[USER:REGISTER] ${email} registration failed:`, error)
    ctx.body = {
      success: false,
      message: '注册失败，请稍后重试'
    }
  }
}

/**
 * 邮箱登录
 */
const loginByEmail = async (ctx) => {
  const { email, password } = ctx.request.body

  if (!validateEmail(email)) {
    return ctx.body = {
      success: false,
      message: '邮箱格式不正确'
    }
  }

  if (!password) {
    return ctx.body = {
      success: false,
      message: '密码不能为空'
    }
  }

  try {
    // 获取用户信息
    const user = await network.user.getUserByEmail(email)
    if (!user) {
      return ctx.body = {
        success: false,
        message: '邮箱或密码错误'
      }
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return ctx.body = {
        success: false,
        message: '邮箱或密码错误'
      }
    }

    // 检查邮箱是否已验证
    if (!user.emailVerified) {
      return ctx.body = {
        success: false,
        message: '请先验证你的邮箱地址'
      }
    }

    // 设置会话
    ctx.session.userId = user.userId
    ctx.session.githubLogin = user.name || user.email.split('@')[0] // 兼容现有系统
    ctx.session.userEmail = user.email
    ctx.session.loginType = 'email'

    logger.info(`[USER:LOGIN] ${email} logged in successfully`)
    ctx.body = {
      success: true,
      message: '登录成功',
      result: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        loginType: 'email'
      }
    }
  } catch (error) {
    logger.error(`[USER:LOGIN] ${email} login failed:`, error)
    ctx.body = {
      success: false,
      message: '登录失败，请稍后重试'
    }
  }
}

/**
 * 验证邮箱
 */
const verifyEmail = async (ctx) => {
  const { token } = ctx.request.query || ctx.request.body

  if (!token) {
    return ctx.body = {
      success: false,
      message: '验证链接无效'
    }
  }

  try {
    const result = await network.user.verifyEmail({ token })
    if (result.success) {
      ctx.body = {
        success: true,
        message: '邮箱验证成功！现在你可以登录了。'
      }
    } else {
      ctx.body = {
        success: false,
        message: result.message || '验证失败，链接可能已过期'
      }
    }
  } catch (error) {
    logger.error('[USER:VERIFY] Email verification failed:', error)
    ctx.body = {
      success: false,
      message: '验证失败，请稍后重试'
    }
  }
}

/**
 * 发送密码重置邮件
 */
const requestPasswordReset = async (ctx) => {
  const { email } = ctx.request.body

  if (!validateEmail(email)) {
    return ctx.body = {
      success: false,
      message: '邮箱格式不正确'
    }
  }

  try {
    const user = await network.user.getUserByEmail(email)
    if (!user) {
      // 为了安全，即使用户不存在也返回成功
      return ctx.body = {
        success: true,
        message: '如果该邮箱已注册，你将收到密码重置邮件'
      }
    }

    // 生成重置token
    const resetToken = generateResetToken()
    // 保存重置token
    await network.user.resetPassword({
      email,
      resetToken,
      resetTokenExpires: new Date(Date.now() + (24 * 60 * 60 * 1000)) // 24小时
    })

    // 发送重置邮件
    const emailSent = await emailService.sendPasswordResetEmail(email, resetToken, user.name)
    if (!emailSent) {
      logger.warn(`[EMAIL] Failed to send password reset email to ${email}`)
    }

    logger.info(`[USER:RESET] Password reset requested for ${email}`)
    ctx.body = {
      success: true,
      message: '如果该邮箱已注册，你将收到密码重置邮件'
    }
  } catch (error) {
    logger.error('[USER:RESET] Password reset request failed:', error)
    ctx.body = {
      success: false,
      message: '请求失败，请稍后重试'
    }
  }
}

/**
 * 确认密码重置
 */
const confirmPasswordReset = async (ctx) => {
  const { token, newPassword } = ctx.request.body

  if (!token) {
    return ctx.body = {
      success: false,
      message: '重置链接无效'
    }
  }

  // 验证新密码
  const passwordValidation = validatePassword(newPassword)
  if (!passwordValidation.valid) {
    return ctx.body = {
      success: false,
      message: passwordValidation.errors.join(', ')
    }
  }

  try {
    // 加密新密码
    const hashedPassword = await hashPassword(newPassword)
    const result = await network.user.confirmPasswordReset({
      token,
      newPassword: hashedPassword
    })

    if (result.success) {
      logger.info(`[USER:RESET] Password reset completed for user ${result.userId}`)
      ctx.body = {
        success: true,
        message: '密码重置成功！现在你可以使用新密码登录了。'
      }
    } else {
      ctx.body = {
        success: false,
        message: result.message || '重置失败，链接可能已过期'
      }
    }
  } catch (error) {
    logger.error('[USER:RESET] Password reset confirmation failed:', error)
    ctx.body = {
      success: false,
      message: '重置失败，请稍后重试'
    }
  }
}

export default {
  // user
  logout,
  clearCache,
  getUserInfo,
  getGitHubSections,
  patchUserInfo,
  loginByGitHub,
  initialFinished,
  // email auth
  registerByEmail,
  loginByEmail,
  verifyEmail,
  requestPasswordReset,
  confirmPasswordReset,
  // notify
  markNotifies,
  voteNotify,
  getUnreadNotifies
}

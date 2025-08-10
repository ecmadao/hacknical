
export const ttl = 600

export const getUser = qs => ({
  qs,
  url: '/user'
})

export const createUser = data => ({
  body: { data },
  method: 'post',
  url: '/user'
})

export const updateUser = (userId, data) => ({
  body: {
    data,
    userId
  },
  method: 'put',
  url: '/user'
})

export const getUserCount = () => ({
  useCache: true,
  url: '/user/count'
})

/* =========================================================== */

export const getResume = qs => ({
  qs,
  url: '/resume'
})

export const updateResume = ({
  userId,
  login,
  resume,
  locale
}) => ({
  body: {
    login,
    resume,
    userId,
    locale
  },
  method: 'put',
  url: '/resume'
})

export const getResumeInfo = qs => ({
  qs,
  url: '/resume/information'
})

export const setResumeInfo = ({ userId, login, info }) => ({
  body: {
    info,
    login,
    userId
  },
  method: 'put',
  url: '/resume/information'
})

export const getResumeCount = () => ({
  useCache: true,
  url: '/resume/count'
})

/* =========================================================== */
/* Email Authentication APIs */

export const createUserByEmail = data => ({
  body: { data },
  method: 'post',
  url: '/user/email'
})

export const loginByEmail = data => ({
  body: { data },
  method: 'post',
  url: '/user/login/email'
})

export const verifyEmail = data => ({
  body: { data },
  method: 'post',
  url: '/user/verify-email'
})

export const resetPassword = data => ({
  body: { data },
  method: 'post',
  url: '/user/reset-password'
})

export const confirmPasswordReset = data => ({
  body: { data },
  method: 'post',
  url: '/user/confirm-reset-password'
})

export const getUserByEmail = email => ({
  qs: { email },
  url: '/user/email/info'
})


export const VALIDATE_DASHBOARD = new Set([
  'records',
  'archive',
  'visualize',
  'setting'
])

export const REQUIRED_SESSIONS = [
  'userId',
  'githubToken',
  'githubLogin'
]

export const UPDATE_STATUS_TEXT = {
  1: 'messages.update.succeed',
  // 2: 'messages.update.pending',
  // 3: 'messages.update.running',
  4: 'messages.update.failed',
  5: 'messages.update.frequently'
}

export const REQUEST_JSON_METHODS = ['PUT', 'POST', 'DELETE', 'PATCH']

export const SIGNAL = {
  NEED_LOGIN: 'NEED_LOGIN'
}

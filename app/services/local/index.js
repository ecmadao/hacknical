import user from './user'
import github from './github'
import stat from './stat'

const ip = {
  getInfo: async ipAddress => JSON.stringify({
    ip: ipAddress,
    addr: ipAddress === '127.0.0.1' || ipAddress === '::1' ? 'localhost' : ''
  })
}

const besticon = {
  getIcon: async () => ({ icons: [] })
}

export default {
  user,
  github,
  stat,
  ip,
  besticon
}

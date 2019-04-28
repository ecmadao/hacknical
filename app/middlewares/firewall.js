
import NewError from '../utils/error'

const firewallMiddleware = (options = {}) => {
  const { blockList = [] } = options
  const tmp = new Set(blockList)

  return async (ctx, next) => {
    const { ip } = ctx.request
    if (tmp.has(ip)) {
      throw new NewError.PermissionError('FUCK OFF')
    }

    await next()
  }
}

export default firewallMiddleware

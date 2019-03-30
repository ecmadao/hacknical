
import { toPromise } from 'UTILS/helper'

class HeartBeat {
  constructor(options = {}) {
    const {
      interval = 1000, // 1s
      callback = Function.prototype
    } = options
    this.state = {
      interval,
      callback
    }
    this.timeout = null
    this.enable = true
  }

  takeoff(...args) {
    this.enable = true
    this.callback(...args)()
  }

  start(...args) {
    this.timeout = setTimeout(this.callback(...args), this.state.interval)
  }

  stop() {
    this.clearTimeout()
    this.enable = false
  }

  callback(...args) {
    const { callback } = this.state
    return () => toPromise(callback)(...args).then(() => {
      this.clearTimeout()
      this.enable && this.start(...args)
    })
  }

  clearTimeout() {
    this.timeout && clearTimeout(this.timeout)
    this.timeout = null
  }
}

export default HeartBeat

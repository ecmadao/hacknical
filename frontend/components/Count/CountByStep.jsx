
import PropTypes from 'prop-types'
import HeartBeat from 'UTILS/heartbeat'
import BaseCount from './BaseCount'

class CountByStep extends BaseCount {
  constructor(props) {
    super(props)

    this.heartBeat = null
  }

  getNext(startTime) {
    const { timing, duration, start, end } = this.props
    const time = new Date().getTime() - startTime

    let result = this.state.current
    switch (timing) {
      case 'logarithm':
        const base = Math.pow(duration, 1 / end)
        result = Math.log(time) / Math.log(base)
        break
      case 'linear':
      default:
        result = (time / duration) * (end - start)
        break
    }
    return Math.min(end, Math.floor(result))
  }

  start() {
    const { end, interval, onFinish } = this.props

    if (!this.heartBeat) {
      this.heartBeat = new HeartBeat({
        interval,
        callback: (startTime) => {
          if (this.state.current < end) {
            this.setState({
              current: this.getNext(startTime)
            })
          } else {
            onFinish()
            this.heartBeat.stop()
          }
        }
      })
    }
    this.heartBeat.takeoff(new Date().getTime())
  }

  stop() {
    this.heartBeat && this.heartBeat.stop()
  }
}

CountByStep.propTypes = {
  duration: PropTypes.number,
  interval: PropTypes.number,
  onFinish: PropTypes.func,
  timing: PropTypes.string
}

CountByStep.defaultProps = {
  duration: 2000,
  interval: 1,
  onFinish: Function.prototype,
  timing: 'linear'
}

export default CountByStep

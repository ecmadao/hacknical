
import PropTypes from 'prop-types'
import BaseCount from './BaseCount'

class CountByDuration extends BaseCount {
  constructor(props) {
    super(props)

    this.state = {
      current: props.start,
      startTime: 0
    }
    this._start = this._start.bind(this)
  }

  start() {
    requestAnimationFrame(this._start)
  }

  _start(timestamp) {
    let { startTime, current } = this.state
    const { end, duration, onFinish } = this.props

    if (!startTime) startTime = timestamp

    const progress = timestamp - startTime
    let value = Math.floor(
      current + Math.ceil(((end - current) * (progress / duration)))
    )
    value = Math.min(value, end)

    this.setState({
      startTime,
      current: value
    })

    if (value < end) {
      requestAnimationFrame(this._start)
    } else {
      this.setState({
        startTime: 0
      })
      onFinish()
    }
  }
}

CountByDuration.propTypes = {
  duration: PropTypes.number,
  onFinish: PropTypes.func
}

CountByDuration.defaultProps = {
  duration: 2000,
  onFinish: Function.prototype
}

export default CountByDuration

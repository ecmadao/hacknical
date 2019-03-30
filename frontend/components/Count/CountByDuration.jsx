
import React from 'react'
import PropTypes from 'prop-types'

class CountByDuration extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      current: props.start,
      startTime: 0
    }
    this.start = this.start.bind(this)
    this.heartBeat = null
  }

  componentDidMount() {
    requestAnimationFrame(this.start)
  }

  start(timestamp) {
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

    if (progress < duration) {
      requestAnimationFrame(this.start)
    } else {
      this.setState({
        startTime: 0
      })
      onFinish()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { start } = nextProps
    if (start !== this.props.start) {
      this.setState({ current: start })
    }
  }

  componentDidUpdate(preProps) {
    const { end } = preProps
    if (this.props.end !== end) {
      requestAnimationFrame(this.start)
    }
  }

  render() {
    const { current, render } = this.state
    return (
      render(current)
    )
  }
}

CountByDuration.propTypes = {
  duration: PropTypes.number,
  start: PropTypes.number,
  end: PropTypes.number,
  render: PropTypes.func,
  onFinish: PropTypes.func
}

CountByDuration.defaultProps = {
  start: 0,
  end: 100,
  duration: 2000,
  render: Function.prototype,
  onFinish: Function.prototype
}

export default CountByDuration


import React from 'react'
import PropTypes from 'prop-types'
import HeartBeat from 'UTILS/heartbeat'

class CountByStep extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      current: props.start
    }
    this.start = this.start.bind(this)
    this.heartBeat = null
  }

  componentDidMount() {
    this.start()
  }

  start() {
    const { onFinish } = this.props

    if (!this.heartBeat) {
      this.heartBeat = new HeartBeat({
        interval: this.props.interval,
        callback: () => {
          if (this.state.current < this.props.end) {
            this.setState({
              current: this.state.current + this.props.step
            })
          } else {
            onFinish()
            this.heartBeat.stop()
          }
        }
      })
    }
    this.heartBeat.takeoff()
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
      this.start()
    }
  }

  render() {
    const { render, current } = this.state
    return (
      render(current)
    )
  }
}

CountByStep.propTypes = {
  interval: PropTypes.number,
  start: PropTypes.number,
  end: PropTypes.number,
  step: PropTypes.number,
  render: PropTypes.func,
  onFinish: PropTypes.func
}

CountByStep.defaultProps = {
  interval: 1,
  start: 0,
  end: 100,
  step: 1,
  render: Function.prototype,
  onFinish: Function.prototype
}

export default CountByStep

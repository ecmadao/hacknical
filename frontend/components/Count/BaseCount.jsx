
import React from 'react'
import PropTypes from 'prop-types'

class BaseCount extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      current: props.start
    }
    this.start = this.start.bind(this)
  }

  componentDidMount() {
    this.start()
  }

  componentDidUpdate(preProps) {
    const { end } = preProps
    if (this.props.end !== end) {
      this.start()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { start } = nextProps
    if (start !== this.props.start) {
      this.setState({ current: start })
    }
  }

  componentWillUnmount() {
    this.stop()
  }

  start() {
    throw new Error('start func should be rewrite')
  }

  stop() {}

  render() {
    const { render } = this.props
    const { current } = this.state
    return render(current)
  }
}

BaseCount.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number,
  render: PropTypes.func,
}

BaseCount.defaultProps = {
  start: 0,
  end: 100,
  render: () => null
}

export default BaseCount

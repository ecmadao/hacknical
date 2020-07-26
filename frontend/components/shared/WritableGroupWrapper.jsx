
import React, { cloneElement } from 'react'
import Hotkeys from 'UTILS/hotkeys'

class WritableGroupWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
    this.onKeyDown = this.onKeyDown.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  onKeyDown(e) {
    const { value } = this.state
    if (Hotkeys.isEnter(e)) {
      const { onAdd } = this.props
      onAdd && onAdd(value)
      this.clearInput()
    }
  }

  handleInputChange(value) {
    this.setState({ value })
  }

  clearInput() {
    this.setState({ value: '' })
  }

  render() {
    const child = cloneElement(this.props.children, {
      value: this.state.value,
      onChange: this.handleInputChange,
      onKeyDown: this.onKeyDown
    })
    return child
  }
}

export default WritableGroupWrapper

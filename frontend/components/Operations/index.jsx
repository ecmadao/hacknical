import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import OperationItem from './OperationItem'
import cx from 'classnames'
import { OutsideClickHandler } from 'light-ui'
import styles from './operations.css'

class Operations extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showOperations: props.showOperations || false
    }

    this.showOperationMenu = this.showOperationMenu.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
  }

  showOperationMenu() {
    this.changeOperationStatus(true)
  }

  changeOperationStatus(status) {
    if (status === this.state.showOperations) return

    this.setState({
      showOperations: status
    })
    const { onFocusChange } = this.props
    onFocusChange && onFocusChange(status)
  }

  handleOutsideClick() {
    this.changeOperationStatus(false)
  }

  renderMenus() {
    const { items } = this.props
    return items.map((item, index) => (
      <OperationItem
        key={index}
        item={item}
      />
    ))
  }

  get triggerFunc() {
    switch (this.props.trigger) {
      case 'hover':
        return {
          onMouseOver: this.showOperationMenu.bind(this),
          onMouseEnter: this.showOperationMenu.bind(this),
          onMouseOut: this.showOperationMenu.bind(this),
          onMouseLeave: this.showOperationMenu.bind(this)
        }
      case 'click':
      default:
        return {
          onClick: this.showOperationMenu.bind(this),
        }
    }
  }

  render() {
    const { showOperations } = this.state
    const { children, className, disabled } = this.props

    const containerClass = cx(
      styles.container,
      className
    )
    const moreIconClass = cx(
      disabled && styles.disabled
    )
    const menuClass = cx(
      styles.menu,
      showOperations && styles.menuActive
    )

    const Operation = createElement(
      'div',
      Object.assign({
        className: moreIconClass
      }, this.triggerFunc),
      children
    )

    return (
      <OutsideClickHandler
        onOutsideClick={this.handleOutsideClick}>
        <div className={containerClass}>
          {Operation}
          <div
            className={menuClass}
            ref={ref => (this.operationMenu = ref)}>
            {this.renderMenus()}
          </div>
        </div>
      </OutsideClickHandler>
    )
  }
}

Operations.propTypes = {
  items: PropTypes.array,
  disabled: PropTypes.bool,
  trigger: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.array,
    PropTypes.string
  ]),
  onFocusChange: PropTypes.func
}

Operations.defaultProps = {
  items: [],
  disabled: false,
  trigger: 'click',
  className: '',
  children: <div />,
  onFocusChange: Function.prototype
}

export default Operations


import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { OutsideClickHandler } from 'light-ui'
import styles from '../styles/predictions.css'
import Icon from 'COMPONENTS/Icon'

class CardMenu extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: props.showMenu || false
    }
    this.toggleMenu = this.toggleMenu.bind(this)
    this.changeMenuStatus = this.changeMenuStatus.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
  }

  toggleMenu() {
    const { showMenu } = this.state
    this.changeMenuStatus(!showMenu)
  }

  handleOutsideClick() {
    this.changeMenuStatus(false)
  }

  changeMenuStatus(status) {
    if (status === this.state.showMenu) return
    this.setState({
      showMenu: status
    })
    const { onFocusChange } = this.props
    onFocusChange && onFocusChange(status)
  }

  handleMenuClick(callback) {
    return () => {
      callback && callback()
      this.changeMenuStatus(false)
    }
  }

  renderMenus() {
    const { items } = this.props
    return items.map((item, index) => {
      const {
        icon,
        text,
        onClick,
        className = '',
      } = item
      return (
        <div
          className={cx(
            styles.menuItem,
            className
          )}
          key={index}
          onClick={this.handleMenuClick(onClick)}
        >
          {icon ? (
            <Icon icon={icon} />
          ) : null}
          {text}
        </div>
      )
    })
  }

  render() {
    const { showMenu } = this.state

    const menuClass = cx(
      styles.menuWrapper,
      showMenu && styles.menuActive
    )

    return (
      <OutsideClickHandler
        onOutsideClick={this.handleOutsideClick}>
        <div className={styles.cardMenu}>
          <Icon icon="ellipsis-h" onClick={this.toggleMenu} />
          <div
            className={menuClass}
            ref={ref => (this.menu = ref)}
          >
            {this.renderMenus()}
          </div>
        </div>
      </OutsideClickHandler>
    )
  }
}

CardMenu.propTypes = {
  items: PropTypes.array,
  onFocusChange: PropTypes.func
}

CardMenu.defaultProps = {
  items: [],
  onFocusChange: Function.prototype
}

export default CardMenu

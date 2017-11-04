import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from '../styles/scientific.css';

class CardMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: props.showMenu || false
    };
    this.openMenu = this.openMenu.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  openMenu() {
    this.changeMenuStatus(true);
  }

  componentDidMount() {
    if (document.addEventListener) {
      document.addEventListener('click', this.handleOutsideClick, true);
    } else {
      document.attachEvent('click', this.handleOutsideClick);
    }
  }

  componentWillUnmount() {
    if (document.removeEventListener) {
      document.removeEventListener('click', this.handleOutsideClick, true);
    } else {
      document.detachEvent('click', this.handleOutsideClick);
    }
  }

  handleOutsideClick(e) {
    const event = e || window.event;
    const isDescendantOfRoot = this.menu && this.menu.contains(event.target);
    if (!isDescendantOfRoot) {
      this.changeMenuStatus(false);
    }
  }

  changeMenuStatus(status) {
    if (status === this.state.showMenu) return;
    this.setState({
      showMenu: status
    });
    const { onFocusChange } = this.props;
    onFocusChange && onFocusChange(status);
  }

  renderMenus() {
    const { items } = this.props;
    return items.map((item, index) => {
      const {
        icon,
        text,
        onClick,
        className = '',
      } = item;
      return (
        <div
          className={cx(
            styles.menuItem,
            className
          )}
          key={index}
          onClick={onClick}
        >
          { icon ? (
            <i
              className={`fa fa-${icon}`}
              aria-hidden="true"
            />
          ) : '' }
          {text}
        </div>
      );
    });
  }

  render() {
    const { showMenu } = this.state;

    const menuClass = cx(
      styles.menuWrapper,
      showMenu && styles.menuActive
    );

    return (
      <div className={styles.cardMenu}>
        <i
          className="fa fa-ellipsis-h"
          aria-hidden="true"
          onClick={this.openMenu}
        />
        <div
          className={menuClass}
          ref={ref => (this.menu = ref)}
        >
          {this.renderMenus()}
        </div>
      </div>
    );
  }
}

CardMenu.propTypes = {
  items: PropTypes.array,
  onFocusChange: PropTypes.func
};

CardMenu.defaultProps = {
  items: [],
  onFocusChange: () => {}
};

export default CardMenu;

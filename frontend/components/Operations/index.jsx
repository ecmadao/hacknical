import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import OperationItem from './OperationItem';
import cx from 'classnames';
import styles from './operations.css';

class Operations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showOperations: props.showOperations || false
    };
    this.showOperationMenu = this.showOperationMenu.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  showOperationMenu() {
    this.changeOperationStatus(true);
  }

  changeOperationStatus(status) {
    this.setState({
      showOperations: status
    });
    const { onFocusChange } = this.props;
    onFocusChange && onFocusChange(status);
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

  componentDidUpdate() {
    const { showOperations } = this.props;
    if (showOperations !== this.state.showOperations) {
      this.setState({ showOperations })
    }
  }

  handleOutsideClick(e) {
    e = e || window.event;
    const mouseTarget = (typeof e.which !== "undefined") ? e.which : e.button;
    const menu = ReactDOM.findDOMNode(this.operationMenu);
    const isDescendantOfRoot = menu && menu.contains(e.target);
    if (!isDescendantOfRoot) {
      this.changeOperationStatus(false);
    }
  }

  renderMenus() {
    const { items } = this.props;
    return items.map((item, index) => {
      return (
        <OperationItem
          key={index}
          item={item}
        />
      )
    });
  }

  render() {
    const { showOperations } = this.state;
    const { className } = this.props;

    const containerClass = cx(
      styles["operations_container"],
      className
    );
    const moreIconClass = cx(
      styles["operations_more"],
      showOperations && styles["active"]
    );
    const menuClass = cx(
      styles["operations_menu"],
      showOperations && styles["operations_menu_active"]
    );
    return (
      <div className={containerClass}>
        <div
          className={moreIconClass}
          onClick={this.showOperationMenu}>
          <i
            className="fa fa-ellipsis-h"
            aria-hidden="true"></i>
        </div>
        <div
          className={menuClass}
          ref={ref => this.operationMenu = ref}>
          {this.renderMenus()}
        </div>
      </div>
    )
  }
}

Operations.propTypes = {
  items: PropTypes.array,
  className: PropTypes.string,
  onFocusChange: PropTypes.func
};

Operations.defaultProps = {
  items: [],
  className: '',
  onFocusChange: () => {}
};

export default Operations;

import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './button.css';

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false
    };
    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { pressed } = this.state;
    const { disabled } = this.props;
    return pressed !== nextState.pressed || disabled !== nextProps.disabled;
  }

  onClick(e) {
    const { onClick } = this.props;
    onClick && onClick();
  }

  onMouseDown() {
    this.setState({ pressed: true });
  }

  onMouseUp() {
    this.setState({ pressed: false });
  }

  render() {
    const {
      value,
      className,
      leftIcon,
      rightIcon,
      style,
      color,
      disabled
    } = this.props;
    const { pressed } = this.state;
    const buttonClass = cx(
      styles["button"],
      styles[style],
      styles[color],
      pressed && styles["pressDown"],
      disabled && styles["disabled"],
      className
    );
    const onClick = disabled ? () => {} : this.onClick;
    return (
      <div
        className={buttonClass}
        onMouseDown={this.onMouseDown}
        onMouseOut={this.onMouseUp}
        onMouseLeave={this.onMouseUp}
        onMouseUp={this.onMouseUp}
        onClick={onClick}>
        <div className={styles["wrapper"]}>
          {leftIcon}
          <span>
            {value}
          </span>
          {rightIcon}
        </div>
      </div>
    )
  }
}

Button.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.string,
  disabled: PropTypes.bool,
  leftIcon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.object
  ]),
  rightIcon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.object
  ])
};

Button.defaultProps = {
  value: '',
  color: 'green',
  style: 'material',
  onClick: () => {},
  leftIcon: null,
  rightIcon: null,
  className: '',
  disabled: false
}

export default Button;

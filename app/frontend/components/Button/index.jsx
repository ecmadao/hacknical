import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './button.css';

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    const {onClick} = this.props;
    onClick && onClick();
  }

  render() {
    const {value, className, leftIcon, rightIcon, style} = this.props;
    const buttonClass = cx(
      styles["button"],
      styles[style],
      styles[className]
    )
    return (
      <div
        className={buttonClass}
        onClick={this.onClick}>
        {leftIcon}
        <span>
          {value}
        </span>
        {rightIcon}
      </div>
    )
  }
}

Button.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.string,
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
  className: 'blue',
  style: 'material',
  onClick: () => {},
  leftIcon: null,
  rightIcon: null
}

export default Button;

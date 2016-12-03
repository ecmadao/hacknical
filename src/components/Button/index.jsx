import React, { PropTypes } from 'react';
import './button.css';

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
    const {value, className, leftIcon, rightIcon} = this.props;
    return (
      <div
        className={`button ${className}`}
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
  onClick: () => {},
  leftIcon: null,
  rightIcon: null
}

export default Button;

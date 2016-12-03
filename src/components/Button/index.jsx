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
    const {value, className} = this.props;
    return (
      <div className={`button ${className}`}>
        {value}
      </div>
    )
  }
}

Button.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string
};

Button.defaultProps = {
  value: '',
  className: 'blue',
  onClick: () => {}
}

export default Button;

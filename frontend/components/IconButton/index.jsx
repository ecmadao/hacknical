import React, { PropTypes } from 'react';
import cx from 'classnames';

import styles from './icon_button.css';

class IconButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false
    };
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  onMouseUp() {
    this.setState({
      pressed: false
    });
  }

  onMouseDown() {
    this.setState({
      pressed: true
    });
  }

  render() {
    const { pressed } = this.state;
    const { icon, onClick, className, id, disabled } = this.props;
    const containerClass = cx(
      styles["container"],
      pressed && styles["pressed"],
      disabled && styles["disabled"],
      className
    );
    return (
      <div
        id={id}
        className={containerClass}
        onClick={onClick}
        onMouseUp={this.onMouseUp}
        onMouseLeave={this.onMouseUp}
        onMouseEnter={this.onMouseDown}
        onMouseDown={this.onMouseDown}>
        <i className={`fa fa-${icon}`} aria-hidden="true"></i>
      </div>
    )
  }
}

IconButton.propTypes = {
  icon: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

IconButton.defaultProps = {
  icon: 'hand-spock-o',
  onClick: () => {},
  className: '',
  id: '',
  disabled: false
};

export default IconButton;

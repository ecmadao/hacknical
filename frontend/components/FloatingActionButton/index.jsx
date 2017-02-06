import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './floating_action_button.css';

class FloatingActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false
    };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  onMouseDown() {
    this.setState({ pressed: true });
  }

  onMouseUp() {
    this.setState({ pressed: false });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { pressed } = this.state;
    return pressed !== nextState.pressed;
  }

  render() {
    const {
      icon,
      style,
      onClick,
      backgroundColor
    } = this.props;
    const { pressed } = this.state;
    style['backgroundColor'] = backgroundColor ? backgroundColor : style['backgroundColor'];
    const buttonClass = cx(
      styles["floating_action_button"],
      pressed && styles["pressDown"]
    );
    return (
      <div
        style={style}
        onClick={onClick}
        onMouseDown={this.onMouseDown}
        onMouseOut={this.onMouseUp}
        onMouseLeave={this.onMouseUp}
        onMouseUp={this.onMouseUp}
        className={buttonClass}>
        <i className={`fa fa-${icon}`} aria-hidden="true"></i>
      </div>
    )
  }
}

FloatingActionButton.propTypes = {
  style: PropTypes.object,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  backgroundColor: PropTypes.string,
};

FloatingActionButton.defaultProps = {
  style: {},
  onClick: () => {},
  icon: '',
  backgroundColor: ''
};

export default FloatingActionButton;

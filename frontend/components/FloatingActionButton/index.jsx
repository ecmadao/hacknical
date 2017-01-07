import React, { PropTypes } from 'react';
import styles from './floating_action_button.css';

class FloatingActionButton extends React.Component {
  render() {
    const {
      icon,
      style,
      onClick,
      backgroundColor
    } = this.props;
    style['backgroundColor'] = backgroundColor ? backgroundColor : style['backgroundColor'];
    return (
      <div
        style={style}
        onClick={onClick}
        className={styles["floating_action_button"]}>
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

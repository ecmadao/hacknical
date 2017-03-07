import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './tipso.css';

class Tipso extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, show, className, style } = this.props;
    const containerClass = cx(
      styles["tipso_container"],
      show && styles["active"],
      className
    );
    return (
      <div
        style={style}
        className={containerClass}>
        {children}
        {/* <div className={styles["tipso_angle_mock"]}></div> */}
      </div>
    )
  }
}

Tipso.propTypes = {
  show: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.element,
  className: PropTypes.string
};

Tipso.defaultProps = {
  show: false,
  style: {},
  children: (<div></div>),
  className: ''
};

export default Tipso;

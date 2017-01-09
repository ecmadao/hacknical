import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './tipso.css';

class Tipso extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, show, style } = this.props;
    const containerClass = cx(
      styles["tipso_container"],
      show && styles["active"],
      style
    );
    return (
      <div
        className={containerClass}>
        {children}
        {/* <div className={styles["tipso_angle_mock"]}></div> */}
      </div>
    )
  }
}

Tipso.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.element,
  style: PropTypes.string
};

Tipso.defaultProps = {
  show: false,
  children: (<div></div>),
  style: ''
};

export default Tipso;

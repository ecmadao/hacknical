import React, { PropTypes } from 'react';
import './tipso.css';

class Tipso extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, onMouseEnter, onMouseOut } = this.props;
    return (
      <div
        className="tipso_container">
        {children}
        <div className="tipso_angle_mock"></div>
      </div>
    )
  }
}

Tipso.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.element,
  onMouseEnter: PropTypes.func
};

Tipso.defaultProps = {
  show: false,
  children: (<div></div>),
  onMouseEnter: () => {}
};

export default Tipso;

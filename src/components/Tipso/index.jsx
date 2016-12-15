import React, { PropTypes } from 'react';
import './tipso.css';

class Tipso extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, show } = this.props;
    return (
      <div
        className={`tipso_container ${show ? 'active' : ''}`}>
        {children}
        <div className="tipso_angle_mock"></div>
      </div>
    )
  }
}

Tipso.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.element
};

Tipso.defaultProps = {
  show: false,
  children: (<div></div>)
};

export default Tipso;

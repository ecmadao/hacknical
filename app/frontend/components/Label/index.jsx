import React, { PropTypes } from 'react';
import cx from 'classnames';
import './label.css';

class Label extends React.Component {
  render() {
    const { style, text, onClick, id, clickable, active } = this.props;
    const labelClass = cx(
      "label",
      !active && clickable && "clickable",
      active && "active"
    );
    return (
      <div
        style={style}
        onClick={() => onClick(id)}
        className={labelClass}>
        {text}
      </div>
    )
  }
}

Label.propTypes = {
  style: PropTypes.object,
  text: PropTypes.string,
  id: PropTypes.string,
  onClick: PropTypes.func,
  clickable: PropTypes.bool,
  active: PropTypes.bool,
};

Label.defaultProps = {
  style: {},
  text: '',
  id: '',
  clickable: true,
  active: false,
  onClick: () => {}
};

export default Label;

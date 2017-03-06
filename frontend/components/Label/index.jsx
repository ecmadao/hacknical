import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './label.css';

class Label extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pressed: false
    };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { pressed } = this.state;
    const { active, clickable } = this.props;
    return active !== nextProps.active || clickable !== nextProps.clickable || pressed !== nextState.pressed;
  }

  onMouseDown() {
    this.setState({ pressed: true });
  }

  onMouseUp() {
    this.setState({ pressed: false });
  }

  render() {
    const { pressed } = this.state;
    const { style, text, onClick, id, clickable, active } = this.props;
    const labelClass = cx(
      styles["label"],
      !active && clickable && styles["clickable"],
      pressed && styles["pressDown"],
      active && styles["active"]
    );
    return (
      <div
        style={style}
        onMouseDown={this.onMouseDown}
        onMouseOut={this.onMouseUp}
        onMouseLeave={this.onMouseUp}
        onMouseUp={this.onMouseUp}
        onClick={() => onClick(id)}
        className={labelClass}>
        <span>
          {text}
        </span>
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

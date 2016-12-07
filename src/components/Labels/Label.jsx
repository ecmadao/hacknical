import React, { PropTypes } from 'react';

class Label extends React.Component {
  render() {
    const { value, onDelete, color } = this.props;
    return (
      <div className={`label_wrapper ${color}`}>
        {value}
        <i
          aria-hidden="true"
          onClick={onDelete}
          className="fa fa-times-circle"></i>
      </div>
    )
  }
}

export default Label;

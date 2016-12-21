import React, { PropTypes } from 'react';

class OperationItem extends React.Component {
  render() {
    const { item } = this.props;
    const { text, icon, onClick } = item;
    return (
      <div
        className="operation_item"
        onClick={onClick}>
        { icon ? (
          <i
            className={`fa fa-${icon}`}
            aria-hidden="true"></i>
        ) : '' }
        {text}
      </div>
    )
  }
}

OperationItem.propTypes = {
  item: PropTypes.object
};

OperationItem.defaultProps = {
  item: {}
};

export default OperationItem;

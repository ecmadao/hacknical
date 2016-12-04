import React, { PropTypes } from 'react';

class ListItem extends React.Component {
  render() {
    return (
      <li></li>
    )
  }
}

ListItem.propTypes = {
  value: PropTypes.array,
  onDelete: PropTypes.func,
  onChange: PropTypes.func
};

ListItem.defaultProps = {
  value: '',
  onDelete: () => {},
  onChange: () => {}
};

export default ListItem;

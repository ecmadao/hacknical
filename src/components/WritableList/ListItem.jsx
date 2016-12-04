import React, { PropTypes } from 'react';

class ListItem extends React.Component {
  render() {
    const {item} = this.props;
    return (
      <li>{item}</li>
    )
  }
}

ListItem.propTypes = {
  item: PropTypes.string,
  onDelete: PropTypes.func,
  onChange: PropTypes.func
};

ListItem.defaultProps = {
  item: '',
  onDelete: () => {},
  onChange: () => {}
};

export default ListItem;

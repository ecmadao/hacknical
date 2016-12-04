import React, { PropTypes } from 'react';

import ListItem from './ListItem';

class WritableList extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onChange(index) {
    const {onChange} = this.props;
    return (value) => {
      onChange && onChange(value, index)
    }
  }

  onDelete(index) {
    const {onDelete} = this.props;
    return () => {
      onDelete && onDelete(index);
    }
  }

  renderListItems() {
    const {items, onDelete, onChange} = this.props;
    return items.map((item, index) => {
      return (
        <ListItem
          key={index}
          item={item}
          onDelete={this.onDelete(index)}
          onChange={this.onChange(index)}
        />
      )
    })
  }

  render() {
    return (
      <div>
        <ul>
          {this.renderListItems()}
          <li>
          </li>
        </ul>
      </div>
    )
  }
}

WritableList.propTypes = {
  items: PropTypes.array,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onChange: PropTypes.func
};

WritableList.defaultProps = {
  items: [],
  onDelete: () => {},
  onAdd: () => {},
  onChange: () => {}
};

export default WritableList;

import React, { PropTypes } from 'react';

import ListItem from './ListItem';
import Input from 'COMPONENTS/Input';

class WritableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  onChange(index) {
    const { onChange } = this.props;
    return (value) => {
      onChange && onChange(value, index)
    }
  }

  onDelete(index) {
    const { onDelete } = this.props;
    return () => {
      onDelete && onDelete(index);
    }
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      const { value } = this.state;
      const { onAdd } = this.props;
      onAdd && onAdd(value);
      this.clearInput();
    }
  }

  handleInputChange(value) {
    value && this.setState({ value })
  }

  clearInput() {
    this.setState({ value: '' });
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
    const { value } = this.state;
    return (
      <div>
        <ul>
          {this.renderListItems()}
          <li>
            <Input
              value={value}
              placeholder="新增项目描述"
              onChange={this.handleInputChange}
              onKeyDown={this.onKeyDown}
            />
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

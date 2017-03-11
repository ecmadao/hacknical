import React, { PropTypes } from 'react';
import { Input } from 'light-ui';

import styles from './writable_list.css';
import ListItem from './ListItem';

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
    const { value } = this.state;
    if (e.keyCode === 13 && value) {
      const { onAdd } = this.props;
      onAdd && onAdd(value);
      this.clearInput();
    }
  }

  handleInputChange(value) {
    this.setState({ value })
  }

  clearInput() {
    this.setState({ value: '' });
  }

  renderListItems() {
    const { items, placeholder } = this.props;
    return items.map((item, index) => {
      return (
        <ListItem
          key={index}
          item={item}
          placeholder={placeholder}
          onDelete={this.onDelete(index)}
          onChange={this.onChange(index)}
        />
      )
    })
  }

  render() {
    const { value } = this.state;
    const { placeholder } = this.props;
    return (
      <ul className={styles["items_wrapper"]}>
        {this.renderListItems()}
        <li>-&nbsp;&nbsp;
          <Input
            value={value}
            check={false}
            theme="borderless"
            style="underline"
            placeholder={placeholder}
            onChange={this.handleInputChange}
            onKeyDown={this.onKeyDown}
          />
        </li>
      </ul>
    )
  }
}

WritableList.propTypes = {
  items: PropTypes.array,
  onAdd: PropTypes.func,
  placeholder: PropTypes.string,
  onDelete: PropTypes.func,
  onChange: PropTypes.func
};

WritableList.defaultProps = {
  items: [],
  placeholder: '',
  onDelete: () => {},
  onAdd: () => {},
  onChange: () => {}
};

export default WritableList;

import React, { PropTypes } from 'react';
import { InputGroup } from 'light-ui';

import styles from './writable_list.css';
import ListItem from './ListItem';
import WritableGroupWrapper from '../WritableGroupWrapper';

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.onLabelChange = this.onLabelChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onLabelChange(index) {
    const { onLabelChange } = this.props;
    return (value) => {
      onLabelChange && onLabelChange(value, index)
    }
  }

  onDelete(index) {
    const { onDelete } = this.props;
    return () => {
      onDelete && onDelete(index);
    }
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
          onChange={this.onLabelChange(index)}
        />
      )
    })
  }

  render() {
    const { value, placeholder, introText, onChange, onKeyDown } = this.props;
    return (
      <ul className={styles["items_wrapper"]}>
        {this.renderListItems()}
        <li>-&nbsp;&nbsp;
          <InputGroup
            value={value}
            required={false}
            theme="borderless"
            subTheme="underline"
            placeholder={placeholder}
            onChange={onChange}
            onKeyDown={onKeyDown}
            wrapperClassName={styles.wrapper}
            inputClassName={styles.input}
          >
            <div style={{fontSize: '12px'}}>
              {introText}
            </div>
          </InputGroup>
        </li>
      </ul>
    )
  }
}

Wrapper.propTypes = {
  items: PropTypes.array,
  onAdd: PropTypes.func,
  placeholder: PropTypes.string,
  introText: PropTypes.string,
  onDelete: PropTypes.func,
  onChange: PropTypes.func
};

Wrapper.defaultProps = {
  items: [],
  placeholder: '',
  introText: '',
  onDelete: () => {},
  onAdd: () => {},
  onChange: () => {}
};

export default Wrapper;

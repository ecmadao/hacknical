import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup } from 'light-ui';

import styles from './writable_list.css';
import ListItem from './ListItem';

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
    return items.map((item, index) => (
      <ListItem
        key={index}
        item={item}
        placeholder={placeholder}
        onDelete={this.onDelete(index)}
        onChange={this.onLabelChange(index)}
      />
    ));
  }

  render() {
    const {
      items,
      value,
      onChange,
      onKeyDown,
      introList,
      placeholder,
      defaultIntro,
    } = this.props;
    return (
      <ul className={styles.items_wrapper}>
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
            tipsoTheme="dark"
          >
            <div className={styles.intro}>
              {introList[items.length] || defaultIntro}
            </div>
          </InputGroup>
        </li>
      </ul>
    );
  }
}

Wrapper.propTypes = {
  items: PropTypes.array,
  placeholder: PropTypes.string,
  defaultIntro: PropTypes.string,
  introList: PropTypes.array,
  onDelete: PropTypes.func,
  onChange: PropTypes.func
};

Wrapper.defaultProps = {
  items: [],
  placeholder: '',
  defaultIntro: '',
  introList: [],
  onDelete: () => {},
  onChange: () => {}
};

export default Wrapper;

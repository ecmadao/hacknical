import React, { PropTypes } from 'react';
import { Input } from 'light-ui';
import styles from './writable_list.css';

const ListItem = (props) => {
  const { item, onChange, onDelete, placeholder } = props;
  return (
    <li className={styles.list_item}>-&nbsp;&nbsp;
      <Input
        value={item}
        onChange={onChange}
        placeholder={placeholder}
        theme="borderless"
        subTheme="underline"
      />&nbsp;&nbsp;&nbsp;
      <i
        className="fa fa-close"
        aria-hidden="true"
        onClick={onDelete}
      />
    </li>
  );
};

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

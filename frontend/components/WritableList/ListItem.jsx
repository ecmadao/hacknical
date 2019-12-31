import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'light-ui'
import styles from './writable.css'
import Icon from 'COMPONENTS/Icon'

const ListItem = (props) => {
  const { id, item, onChange, onDelete, placeholder, onKeyDown } = props
  return (
    <li className={styles.list}>-&nbsp;&nbsp;
      <Input
        id={id}
        value={item}
        onKeyDown={onKeyDown}
        onChange={onChange}
        placeholder={placeholder}
        theme="borderless"
        subTheme="underline"
      />
      &nbsp;&nbsp;&nbsp;
      <Icon icon="close" onClick={onDelete} />
    </li>
  )
}

ListItem.propTypes = {
  item: PropTypes.string,
  onDelete: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
}

ListItem.defaultProps = {
  item: '',
  onDelete: Function.prototype,
  onChange: Function.prototype,
  onKeyDown: Function.prototype,
}

export default ListItem

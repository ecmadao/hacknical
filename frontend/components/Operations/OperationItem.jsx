import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import styles from './operations.css'
import Icon from 'COMPONENTS/Icon'

const OperationItem = (props) => {
  const { item } = props
  const { text, icon, onClick, className } = item

  return (
    <div
      className={cx(styles.item, className)}
      onClick={onClick}
    >
      <Icon icon={icon} />
      {text}
    </div>
  )
}

OperationItem.propTypes = {
  item: PropTypes.object
}

OperationItem.defaultProps = {
  item: {}
}

export default OperationItem

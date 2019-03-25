import React from 'react'
import PropTypes from 'prop-types'
import styles from './operations.css'
import Icon from 'COMPONENTS/Icon'

const OperationItem = (props) => {
  const { item } = props;
  const { text, icon, onClick } = item;

  return (
    <div
      className={styles.item}
      onClick={onClick}
    >
      <Icon icon={icon} />
      {text}
    </div>
  );
};

OperationItem.propTypes = {
  item: PropTypes.object
};

OperationItem.defaultProps = {
  item: {}
};

export default OperationItem;

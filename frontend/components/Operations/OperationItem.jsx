import React from 'react';
import PropTypes from 'prop-types';
import styles from './operations.css';

const OperationItem = (props) => {
  const { item } = props;
  const { text, icon, onClick } = item;

  return (
    <div
      className={styles.operation_item}
      onClick={onClick}
    >
      {icon ? (
        <i
          className={`fa fa-${icon}`}
          aria-hidden="true"
        />
      ) : null}
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

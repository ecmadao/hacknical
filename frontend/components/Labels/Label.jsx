import React from 'react';
import cx from 'classnames';
import styles from './labels.css';

const Label = (props) => {
  const { value, onDelete, color } = props;
  const labelClass = cx(
    styles["label_wrapper"],
    styles[color]
  );
  return (
    <div className={labelClass}>
      {value}
      <i
        aria-hidden="true"
        onClick={onDelete}
        className="fa fa-times-circle"></i>
    </div>
  );
};

export default Label;

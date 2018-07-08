
import React from 'react';
import styles from '../../../styles/resume.css';

const TipsoInputs = (props) => {
  const {
    children,
    prefixIcons,
  } = props;

  const inputs = [];
  children.forEach((child, i) => {
    let prefix = null;
    if (prefixIcons[i]) {
      prefix = (
        <i className={`fa fa-${prefixIcons[i]}`} aria-hidden="true" />
      );
    }
    inputs.push((
      <div className={styles.tipsoInput} key={i}>
        {prefix}
        {child}
      </div>
    ));
  });

  return (
    <div className={styles.project_link_wrapper}>
      {inputs}
    </div>
  );
};

export default TipsoInputs;

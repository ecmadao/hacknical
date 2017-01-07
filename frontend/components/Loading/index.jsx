import React from 'react';
import styles from './loading.css';

const Loading = (props) => {
  return (
    <div className={styles["loading_container"]}>
      <div className={styles["bounce_wrapper"]}>
        <div className={styles["loading_bounce"]}></div>
        <div className={styles["loading_bounce"]}></div>
      </div>
    </div>
  )
}

export default Loading;

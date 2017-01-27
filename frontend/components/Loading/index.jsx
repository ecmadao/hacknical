import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './loading.css';

const Loading = (props) => {
  const containerClass = cx(
    styles["loading_container"],
    props.className
  );
  return (
    <div className={containerClass}>
      <div className={styles["ball-clip-rotate-multiple"]}>
        <div></div>
        <div></div>
      </div>
      {/* <div className={styles["bounce_wrapper"]}>
        <div className={styles["loading_bounce"]}></div>
        <div className={styles["loading_bounce"]}></div>
      </div> */}
    </div>
  )
}

Loading.defaultProps = {
  className: ''
};

export default Loading;

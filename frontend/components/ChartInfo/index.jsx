import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './chart_info.css';

const ChartInfo = (props) => {
  const {
    custom,
    mainText,
    subText,
    mainTextStyle,
    subTextStyle,
    style,
    icon
  } = props;
  const infoClass = cx(
    !custom && styles["chart_info"],
    style
  );

  return (
    <div className={infoClass}>
      <div className={cx(styles["info_main_text"], mainTextStyle)}>
        {icon ? (
          <i className={`fa fa-${icon}`} aria-hidden="true"></i>
        ) : ''}
        {mainText}
      </div>
      <div className={cx(styles["info_sub_text"], subTextStyle)}>
        {subText}
      </div>
    </div>
  )
};

ChartInfo.propTypes = {
  mainText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  subText: PropTypes.string,
  mainTextStyle: PropTypes.string,
  subTextStyle: PropTypes.string,
  style: PropTypes.string,
  icon: PropTypes.string,
  custom: PropTypes.bool
};

ChartInfo.defaultProps = {
  mainText: '',
  subText: '',
  mainTextStyle: '',
  subTextStyle: '',
  style: '',
  icon: null,
  custom: false
};

export default ChartInfo;

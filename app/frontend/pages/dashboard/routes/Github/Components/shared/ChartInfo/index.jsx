import React, { PropTypes } from 'react';
import cx from 'classnames';
import './chart_info.css';

const ChartInfo = (props) => {
  const { mainText, subText, style, icon } = props;
  const infoClass = cx(
    "chart_info",
    style
  );
  return (
    <div className={infoClass}>
      <div className="info_text info_main_text">
        {icon ? (
          <i className={`fa fa-${icon}`} aria-hidden="true"></i>
        ) : ''}
        {mainText}
      </div>
      <div className="info_text info_sub_text">
        {subText}
      </div>
    </div>
  )
};

ChartInfo.propTypes = {
  mainText: PropTypes.string,
  subText: PropTypes.string,
  style: PropTypes.string,
  icon: PropTypes.string,
};

ChartInfo.defaultProps = {
  mainText: '',
  subText: '',
  style: '',
  icon: null
};

export default ChartInfo;

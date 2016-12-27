import React from 'react';
import cx from 'classnames';

class ChartInfo extends React.Component {
  render() {
    const { mainText, subText, style } = this.props;
    const infoClass = cx(
      "chart_info",
      style
    );
    return (
      <div className={infoClass}>
        <div className="info_text info_main_text">
          {mainText}
        </div>
        <div className="info_text info_sub_text">
          {subText}
        </div>
      </div>
    )
  }
}

export default ChartInfo;

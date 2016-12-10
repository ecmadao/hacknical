import React, { PropTypes } from 'react';
import moment from 'moment';
import 'rc-slider/assets/index.css'
import Slider from 'rc-slider';

import './date_slider.css';
import {
  getDateBeforeYears,
  getDateBySeconds,
  // getCurrentSeconds,
  getCurrentDate,
  getSecondsByDate,
  getSecondsBeforeYears
} from '../../utils/date';

const SECONDS_PER_DAY = 24 * 60 * 60;

class DateSlider extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(seconds) {
    const { onStartChange, onEndChange } = this.props;
    const [startSeconds, endSeconds] = seconds;
    onStartChange && onStartChange(getDateBySeconds(startSeconds));
    onEndChange && onEndChange(getDateBySeconds(endSeconds));
  }

  render() {
    const {
      startDate,
      endDate,
      startText,
      endText
    } = this.props;

    return (
      <div className="slider_container">
        <Slider
          range
          allowCross={false}
          min={getSecondsByDate(startDate)}
          max={getSecondsByDate(endDate)}
          defaultValue={[
            getSecondsBeforeYears(2),
            getSecondsBeforeYears(1)
          ]}
          step={SECONDS_PER_DAY}
          tipFormatter={(data) => {
            const date = getDateBySeconds(data);
            return date.split('-').slice(0, 2).join('-')
          }}
          onChange={this.onChange}
          tipTransitionName="rc-slider-tooltip-zoom-down"
        />
        <div className="slider_tips_container">
          <div className="slider_tips">
            {startText}
          </div>
          <div className="slider_tips">
            {endText}
          </div>
        </div>
      </div>
    )
  }
}

DateSlider.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  startText: PropTypes.string,
  endText: PropTypes.string,
  onStartChange: PropTypes.func,
  onEndChange: PropTypes.func
};

DateSlider.defaultProps = {
  startDate: getDateBeforeYears(10),
  endDate: getCurrentDate(),
  startText: '开始时间',
  endText: '结束时间',
  onStartChange: () => {},
  onEndChange: () => {}
};

export default DateSlider;

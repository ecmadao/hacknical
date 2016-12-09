import React, { PropTypes } from 'react';
import moment from 'moment';
import 'rc-slider/assets/index.css'
import Slider from 'rc-slider';

import './date_slider.css';
import {
  getCurrentDate,
  getDateBeforeYears
} from '../../utils/date';

class DateSlider extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      startDate,
      endDate,
      startText,
      endText
    } = this.props;
    return (
      <div>
        <Slider
        />
      </div>
    )
  }
}

DateSlider.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  startText: PropTypes.string,
  endText: PropTypes.string
};

DateSlider.defaultProps = {
  startDate: getDateBeforeYears(30),
  endDate: getCurrentDate(),
  startText: '开始时间',
  endText: '结束时间'
};

export default DateSlider;

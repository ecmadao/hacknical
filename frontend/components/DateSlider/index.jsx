import React, { PropTypes } from 'react';
import moment from 'moment';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

import styles from './date_slider.css';
import dateHelper from 'UTILS/date';

const getDateBySeconds = dateHelper.date.bySeconds;
const getDateBeforeYears = dateHelper.date.beforeYears;
const getValidatorDate = dateHelper.validator.date;
const getSecondsByDate = dateHelper.seconds.getByDate;
const getDateNow = dateHelper.date.now;

const SECONDS_PER_DAY = 24 * 60 * 60;
const VALIDATE_DATE_NOW = getValidatorDate();

class DateSlider extends React.Component {
  constructor(props) {
    super(props);
    const { initialStart, initialEnd } = this.props;
    this.state = {
      startDate: initialStart,
      endDate: initialEnd
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(seconds) {
    const { onStartChange, onEndChange } = this.props;
    const [startSeconds, endSeconds] = seconds;
    const startDate = getDateBySeconds(startSeconds);
    const endDate = getDateBySeconds(endSeconds);

    onStartChange && onStartChange(startDate);
    onEndChange && onEndChange(endDate);
    this.setState({
      startDate,
      endDate
    });
  }

  componentWillReceiveProps(nextProps) {
    const { initialStart, initialEnd } = nextProps;
    this.setState({
      startDate: initialStart,
      endDate: initialEnd
    });
  }

  get pushInterval() {
    const { pushInterval } = this.props;
    switch (pushInterval) {
    case 'day':
      return SECONDS_PER_DAY;
    case 'month':
      return SECONDS_PER_DAY * 30;
    case 'halfYear':
      return SECONDS_PER_DAY * 30 * 6;
    case 'year':
      return SECONDS_PER_DAY * 30 * 12;
    case '2year':
      return SECONDS_PER_DAY * 30 * 24;
    default:
      return SECONDS_PER_DAY * 30;
    }
  }

  render() {
    const {
      minDate,
      maxDate,
      startText,
      endText
    } = this.props;

    const {
      startDate,
      endDate
    } = this.state;

    const maxToday = maxDate === getDateNow();
    const validateEndDate = getValidatorDate(endDate);

    return (
      <div className={styles["slider_container"]}>
        <Slider
          range
          pushable={this.pushInterval}
          allowCross={false}
          min={getSecondsByDate(minDate)}
          max={getSecondsByDate(maxDate)}
          defaultValue={[
            getSecondsByDate(startDate),
            getSecondsByDate(endDate)
          ]}
          value={[
            getSecondsByDate(startDate),
            getSecondsByDate(endDate)
          ]}
          step={SECONDS_PER_DAY}
          tipFormatter={(data) => {
            const date = getDateBySeconds(data);
            const formatDate = getValidatorDate(date);
            return (maxToday && VALIDATE_DATE_NOW === formatDate) ? '至今' : formatDate;
          }}
          onChange={this.onChange}
          tipTransitionName="rc-slider-tooltip-zoom-down"
        />
        <div className={styles["slider_tips_container"]}>
          <div className={styles["slider_tips"]}>
            {startText}
            <span>
              {getValidatorDate(startDate)}
            </span>
          </div>
          <div className={styles["slider_tips"]}>
            <span>
              {(maxToday && VALIDATE_DATE_NOW === validateEndDate) ? '至今' : validateEndDate}
            </span>
            {endText}
          </div>
        </div>
      </div>
    )
  }
}

DateSlider.propTypes = {
  pushInterval: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  startText: PropTypes.string,
  endText: PropTypes.string,
  initialStart: PropTypes.string,
  initialEnd: PropTypes.string,
  onStartChange: PropTypes.func,
  onEndChange: PropTypes.func
};

DateSlider.defaultProps = {
  pushInterval: 'day',
  minDate: getDateBeforeYears(10),
  maxDate: getDateNow(),
  initialStart: getDateBeforeYears(2),
  initialEnd: getDateBeforeYears(1),
  startText: '开始时间',
  endText: '结束时间',
  onStartChange: () => {},
  onEndChange: () => {}
};

export default DateSlider;

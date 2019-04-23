
import React from 'react'
import PropTypes from 'prop-types'
import { Slider } from 'light-ui'
import styles from './slider.css'
import dateHelper from 'UTILS/date'
import locales from 'LOCALES'
import { SECONDS_PER_DAY } from 'UTILS/constant'

const getDateBySeconds = dateHelper.date.bySeconds
const getDateBeforeYears = dateHelper.date.beforeYears
const getValidatorDate = dateHelper.validator.date
const getValidatorFullDate = dateHelper.validator.fullDate
const getSecondsByDate = dateHelper.seconds.getByDate
const afterDays = dateHelper.date.afterDays
const localeTexts = locales('datas.dateSlider')
const MAX_DATE = afterDays(1)

class DateSlider extends React.Component {
  constructor(props) {
    super(props)
    const { initialStart, initialEnd, maxDate } = this.props
    this.state = {
      startDate: initialStart,
      endDate: initialEnd || maxDate
    }
    this.onChange = this.onChange.bind(this)
  }

  onChange(seconds) {
    const { onStartChange, onEndChange } = this.props
    const [startSeconds, endSeconds] = seconds
    const startDate = getDateBySeconds(startSeconds)
    const endDate = getDateBySeconds(endSeconds)

    onStartChange && onStartChange(startDate)
    onEndChange && onEndChange(endDate, endDate === MAX_DATE)
    this.setState({
      startDate,
      endDate
    })
  }

  componentWillReceiveProps(nextProps) {
    const { initialStart, initialEnd, maxDate } = nextProps
    this.setState({
      startDate: initialStart,
      endDate: initialEnd || maxDate
    })
  }

  get pushInterval() {
    const { pushInterval } = this.props
    switch (pushInterval) {
      case 'day':
        return SECONDS_PER_DAY
      case 'month':
        return SECONDS_PER_DAY * 30
      case 'halfYear':
        return SECONDS_PER_DAY * 30 * 6
      case 'year':
        return SECONDS_PER_DAY * 30 * 12
      case '2year':
        return SECONDS_PER_DAY * 30 * 24
      default:
        return SECONDS_PER_DAY * 30
    }
  }

  render() {
    const {
      endText,
      minDate,
      maxDate,
      startText
    } = this.props

    const {
      endDate,
      startDate
    } = this.state
    const validateEndDate = getValidatorFullDate(endDate)

    return (
      <div className={styles.container}>
        <Slider
          min={getSecondsByDate(minDate)}
          max={getSecondsByDate(maxDate)}
          value={[
            getSecondsByDate(startDate),
            getSecondsByDate(endDate)
          ]}
          tipFormatter={(seconds) => {
            const date = getDateBySeconds(seconds)
            const fullDate = getValidatorFullDate(date)
            return (
              <div className={styles.tipso}>
                {MAX_DATE === fullDate ? localeTexts.untilNow : getValidatorDate(date)}
              </div>
            )
          }}
          onChange={this.onChange}
          minRange={SECONDS_PER_DAY}
        />
        <div className={styles.tipsContainer}>
          <div className={styles.tips}>
            {startText}
            <span>
              {getValidatorDate(startDate)}
            </span>
          </div>
          <div className={styles.tips}>
            <span>
              {
                MAX_DATE === validateEndDate
                  ? localeTexts.untilNow
                  : getValidatorDate(endDate)
              }
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
}

DateSlider.defaultProps = {
  pushInterval: 'day',
  minDate: getDateBeforeYears(20),
  maxDate: MAX_DATE,
  initialStart: getDateBeforeYears(2),
  initialEnd: getDateBeforeYears(1),
  startText: localeTexts.startDate,
  endText: localeTexts.endDate,
  onStartChange: Function.prototype,
  onEndChange: Function.prototype,
}

export default DateSlider

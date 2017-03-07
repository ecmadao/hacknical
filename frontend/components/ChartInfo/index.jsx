import React, { PropTypes } from 'react';
import cx from 'classnames';
import Tipso from 'COMPONENTS/Tipso';
import styles from './chart_info.css';

class ChartInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTipso: false
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    this.setState({ showTipso: true })
  }

  onMouseLeave() {
    this.setState({ showTipso: false })
  }

  render() {
    const {
      custom,
      mainText,
      subText,
      mainTextStyle,
      subTextStyle,
      style,
      icon,
      tipso
    } = this.props;
    const { showTipso } = this.state;

    const infoClass = cx(
      !custom && styles["chart_info"],
      style
    );
    return (
      <div className={infoClass}>
        {tipso ? (
          <div className={styles["info_tipso_container"]}>
            <i
              aria-hidden="true"
              onMouseOver={this.onMouseEnter}
              onMouseEnter={this.onMouseEnter}
              onMouseOut={this.onMouseLeave}
              onMouseLeave={this.onMouseLeave}
              className={`fa fa-${tipso.icon || 'question-circle'}`}></i>
            {showTipso ? (
              <Tipso
                show={true}
                style={tipso.style || {}}
                className={styles["info_tipso"]}>
                <span>{tipso.text}</span>
              </Tipso>
            ) : ''}
          </div>
        ) : ''}
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
  }
}

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
  custom: PropTypes.bool,
  tipso: PropTypes.object
};

ChartInfo.defaultProps = {
  mainText: '',
  subText: '',
  mainTextStyle: '',
  subTextStyle: '',
  style: '',
  icon: null,
  custom: false,
  tipso: null
};

export default ChartInfo;

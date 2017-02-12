import React, { PropTypes } from 'react';
import cx from 'classnames';

import styles from './selector_v2.css';
import Option from './Option';
import OutsideClickHandler from './OutsideClickHandler';

const ARROW_DOWN = (
<svg width="11px" height="7px" viewBox="712 206 11 7" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <polygon id="Triangle-1-Copy" stroke="none" fill="" fillRule="evenodd" transform="translate(717.500000, 209.500000) scale(1, -1) translate(-717.500000, -209.500000) " points="717.5 206 723 213 712 213"></polygon>
</svg>
);

class SelectorV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
    this.onChange = this.onChange.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleActiveChange = this.handleActiveChange.bind(this);
  }

  onChange(val) {
    const { onChange } = this.props;
    onChange && onChange(val);
    this.handleOutsideClick();
  }

  handleOutsideClick() {
    this.handleActiveChange(false);
  }

  handleActiveChange(active) {
    this.setState({ active });
  }

  renderOptions() {
    const { active } = this.state;
    const { options, value } = this.props;
    const optionComponents = options.map((option, index) => {
      const { id, text } = option;
      return (
        <Option
          key={index}
          id={id}
          value={text}
          onClick={this.onChange}
          isActive={id === value}
        />
      )
    });
    const wrapperClass = cx(
      styles['options-wrapper'],
      active && styles['options-wrapper-active']
    );
    return (
      <div className={wrapperClass}>
        {optionComponents}
      </div>
    )
  }

  get maxLengthValue() {
    const { options } = this.props;
    let maxValue = options[0].text;
    options.forEach((option) => {
      if (option.text.length > maxValue.length) { maxValue = option.text }
    });
    return maxValue;
  }

  render() {
    const { value, options, theme, color, className, disabled } = this.props;
    const maxLengthValue = this.maxLengthValue;

    const targetOptions = options.filter(option => option.id === value);
    const targetText = (targetOptions[0] && targetOptions[0].text) || '';
    const containerClass = cx(
      styles['selector-container'],
      styles[`selector-${color}`],
      styles[theme],
      disabled && styles['selector-disabled'],
      className
    );

    return (
      <div
        className={containerClass}
        onClick={() => this.handleActiveChange(true)}>
        <OutsideClickHandler
          onOutsideClick={this.handleOutsideClick}>
          <div className={styles.wrapper}>
            <div className={styles['value-wrapper']}>
              <span className={styles['value']}>{targetText}</span>
              <span className={styles['value-hidden']}>{maxLengthValue}</span>
            </div>
            &nbsp;&nbsp;&nbsp;{ARROW_DOWN}
          </div>
          {this.renderOptions()}
        </OutsideClickHandler>
      </div>
    )
  }
}

SelectorV2.propTypes = {
  options: PropTypes.array,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func,
  theme: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

SelectorV2.defaultProps = {
  options: [],
  onChange: () => {},
  theme: 'flat',
  color: 'green',
  className: '',
  disabled: false
}

export default SelectorV2;

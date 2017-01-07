import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './textarea.css';
import Validator from 'UTILS/validator';

class Textarea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      focus: false
    };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  onChange() {
    const value = this.textarea.value;
    const { onChange } = this.props;
    onChange && onChange(value);
    const { error } = this.state;
    if (error) {
      this.check();
    }
  }

  onFocus() {
    this.setState({ focus: true });
  }

  onBlur() {
    this.setState({ focus: false });
    this.check();
  }

  check(inputValue) {
    const value = inputValue || this.textarea.value;
    const { type, max } = this.props;
    const error = !Validator[type](value, max) ? true : false;
    this.setState({ error });
  }

  render() {
    const {
      value,
      style,
      onKeyDown,
      placeholder
    } = this.props;
    const { focus, error } = this.state;

    const wrapperClass = cx(
      styles["textarea_wrapper"],
      styles[style],
      focus && styles["focus"],
      error && styles["error"]
    );

    return (
      <div className={wrapperClass}>
        <pre className={styles["textarea_hidden"]}>
          <span>
            {value}
          </span>
          <br/>
        </pre>
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={this.onChange}
          ref={ref => this.textarea = ref}
          className={styles["textarea"]}
          onKeyDown={onKeyDown}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        />
      </div>
    )
  }
}

Textarea.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  style: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
};

Textarea.defaultProps = {
  value: '',
  placeholder: '',
  style: 'flat',
  onChange: () => {},
  onKeyDown: () => {}
}

export default Textarea;

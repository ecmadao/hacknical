import React, { PropTypes } from 'react';
import './input.css';
import Validator from 'UTILS/validator';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange() {
    const value = this.input.value;
    const {onChange} = this.props;
    onChange && onChange(value);
    const { error } = this.state;
    if (error) {
      this.check();
    }
  }

  onBlur() {
    this.check();
  }

  check(inputValue) {
    const value = inputValue || this.input.value;
    const { type } = this.props;
    const error = !Validator[type](value) ? true : false;
    this.setState({ error });
  }

  render() {
    const {
      value,
      className,
      placeholder,
      type,
      style,
      onKeyDown
    } = this.props;
    const { error } = this.state;

    return (
      <input
        type={type}
        value={value}
        className={`input ${style} ${className} ${error && 'error'}`}
        onChange={this.onChange}
        onKeyDown={onKeyDown}
        onBlur={this.onBlur}
        placeholder={placeholder}
        ref={ref => this.input = ref}
      />
    )
  }
}

Input.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  style: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
};

Input.defaultProps = {
  value: '',
  className: '',
  placeholder: '',
  type: 'string',
  style: 'material',
  onChange: () => {},
  onKeyDown: () => {}
}

export default Input;

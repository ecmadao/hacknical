import React, { PropTypes } from 'react';
import './input.css';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    const value = this.input.value;
    const {onChange} = this.props;
    onChange && onChange(value);
  }

  render() {
    const {value, placeholder, type, style} = this.props;
    return (
      <input
        type={type}
        value={value}
        className={`input ${style}`}
        onChange={this.onChange}
        placeholder={placeholder}
        ref={ref => this.input = ref}
      />
    )
  }
}

Input.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  style: PropTypes.string
};

Input.defaultProps = {
  value: '',
  placeholder: '',
  type: 'string',
  style: 'material',
  onChange: () => {}
}

export default Input;

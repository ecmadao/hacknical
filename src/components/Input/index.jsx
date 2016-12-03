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
    const {value, placeholder, type} = this.props;
    return (
      <input
        type={type}
        value={value}
        className="input"
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
  type: PropTypes.string
};

Input.defaultProps = {
  value: '',
  placeholder: '',
  type: 'string',
  onChange: () => {}
}

export default Input;

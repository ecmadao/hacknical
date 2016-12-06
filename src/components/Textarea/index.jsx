import React, { PropTypes } from 'react';

import './textarea.css';

class Textarea extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' }
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    const value = this.textarea.value;
    const { onChange } = this.props;
    onChange && onChange(value);
    this.setState({ value });
  }

  render() {
    const {
      style,
      onKeyDown,
      placeholder
    } = this.props;
    const { value } = this.state;
    return (
      <div className={`textarea_wrapper ${style}`}>
        <pre className="textarea_hidden">
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
          className="textarea"
          onKeyDown={onKeyDown}
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

import React, { PropTypes } from 'react';

import Input from 'COMPONENTS/Input';
import Tipso from 'COMPONENTS/Tipso';
import './inputs_group.css';

class InputsGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: true
    };
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onBlur() {
    this.setState({ focus: false });
  }

  onFocus() {
    this.setState({ focus: true });
  }

  render() {
    const {
      children
    } = this.props;
    const { focus } = this.state;
    return (
      <div className="input_group_wrapper">
        { focus ? (
          <Tipso
            onMouseOut={this.onBlur}
            onMouseEnter={this.onFocus}>
            {children}
          </Tipso>
        ) : ''}
        <Input
          {...this.props}
          onFocus={this.onFocus}
        />
      </div>
    )
  }
}

export default InputsGroup;

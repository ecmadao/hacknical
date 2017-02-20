import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import Input from 'COMPONENTS/Input';
import Tipso from 'COMPONENTS/Tipso';
import styles from './inputs_group.css';

class InputsGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false
    };
    this.onFocus = this.onFocus.bind(this);
    this.onOutsideClick = this.onOutsideClick.bind(this);
  }

  onFocus() {
    this.setState({ focus: true });
  }

  componentDidMount() {
    if (document.addEventListener) {
      document.addEventListener('mousedown', this.onOutsideClick, true);
    } else {
      document.attachEvent('onmousedown', this.onOutsideClick);
    }
  }

  componentWillUnmount() {
    if (document.removeEventListener) {
      document.removeEventListener('mousedown', this.onOutsideClick, true);
    } else {
      document.detachEvent('onmousedown', this.onOutsideClick);
    }
  }

  onOutsideClick(e) {
    e = e || window.event;
    const mouseTarget = (typeof e.which !== "undefined") ? e.which : e.button;
    const isDescendantOfRoot = ReactDOM.findDOMNode(this.tipso).contains(e.target);
    if (!isDescendantOfRoot && mouseTarget === 1) {
      this.setState({ focus: false });
    }
  }

  render() {
    const {
      children,
      customStyle,
      customInputStyle
    } = this.props;
    const { focus } = this.state;

    return (
      <div
        ref={ref => this.tipso = ref}
        className={cx(styles["input_group_wrapper"], customStyle)}>
        { focus ? (
          <Tipso show={true}>
            {children}
          </Tipso>
        ) : ''}
        <Input
          {...this.props}
          customStyle={cx(styles.input, customInputStyle)}
          onFocus={this.onFocus}
        />
      </div>
    )
  }
}

InputsGroup.defaultProps = {
  customStyle: '',
  customInputStyle: ''
};

export default InputsGroup;

import React, { PropTypes } from 'react';
import Portal from 'react-portal';
import cx from 'classnames';
import styles from './tipso_modal.css';

class TipsoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }

  componentDidMount() {
    this.showTipso();
  }

  showTipso() {
    setTimeout(() => {
      $(this.tipsoModal).addClass('active');
      this.waitToUnmount();
    }, 200);
  }

  waitToUnmount() {
    setTimeout(() => {
      this.setState({
        show: false
      });
    }, 2000);
  }

  render() {
    const { show } = this.state;
    const { text } = this.props;
    const tipsoClass = cx(
      styles["tipso_modal_wrapper"],
      show && styles["active"]
    );
    return (
      <Portal
        isOpened={show}>
        <div
          ref={ref => this.tipsoModal = ref}
          className={tipsoClass}>
          {text}
        </div>
      </Portal>
    )
  }
}

TipsoModal.propTypes = {
  onClose: PropTypes.func,
  text: PropTypes.string
};

TipsoModal.defaultProps = {
  onClose: () => {},
  text: ''
};

export default TipsoModal;

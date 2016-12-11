import React, { PropTypes } from 'react';
import Portal from 'react-portal';
import './tipso_modal.css';

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
    return (
      <Portal
        isOpened={show}>
        <div
          ref={ref => this.tipsoModal = ref}
          className="tipso_modal_wrapper">
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

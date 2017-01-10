import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Clipboard from 'clipboard';

import PortalModal from 'COMPONENTS/PortalModal';
import Input from 'COMPONENTS/Input';
import { GITHUB_GREEN_COLORS } from 'UTILS/colors';
import styles from '../../styles/share_modal.css';

class ShareModal extends React.Component {
  componentDidMount() {
    const { login } = this.props;
    const qrcode = new QRCode(document.getElementById("qrcode"), {
      text: `${window.location.origin}/github/${login}`,
      width: 100,
      height: 100,
      colorDark : GITHUB_GREEN_COLORS[1],
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
    new Clipboard('#copyButton');
    // $('#copyButton').click();
  }

  copyUrl() {
    document.querySelector("#shareUrl").select();
  }

  render() {
    const { openModal, onClose, login } = this.props;
    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}>
        <div className={styles["share_modal_container"]}>
          <div className={styles["share_qrcode"]}>
            <div id="qrcode"></div>
          </div>
          <div className={styles["share_info"]}>
            <blockquote>扫描二维码分享你的 github 总结<br/>或者复制下面的链接进行转发</blockquote>
            <div className={styles["share_container"]}>
              <Input
                id="shareUrl"
                style="flat"
                value={`${window.location.origin}/github/${login}`}
              />
              <div
                id="copyButton"
                data-clipboard-target="#shareUrl"
                className={styles["copy_button"]}
                onClick={this.copyUrl.bind(this)}>
                <i className="fa fa-clipboard" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
      </PortalModal>
    )
  }
}

export default ShareModal;

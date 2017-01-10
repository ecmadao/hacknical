import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Clipboard from 'clipboard';

import PortalModal from 'COMPONENTS/PortalModal';
import IconButton from 'COMPONENTS/IconButton';
import Switcher from 'COMPONENTS/Switcher';
import Input from 'COMPONENTS/Input';

import { GITHUB_GREEN_COLORS } from 'UTILS/colors';
import styles from '../../styles/share_modal.css';

class ShareModal extends React.Component {
  componentDidMount() {
    const { login } = this.props;
    const qrcode = new QRCode(document.getElementById("qrcode"), {
      text: `${window.location.origin}/github/${login}`,
      width: 120,
      height: 120,
      colorDark : GITHUB_GREEN_COLORS[1],
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
    new Clipboard('#copyButton', {
      text: () => $("#shareUrl").val()
    });
  }

  copyUrl() {
    document.querySelector("#shareUrl").select();
  }

  render() {
    const { openModal, onClose, login } = this.props;
    const modalClass = cx(
      styles["share_modal_container"],
      styles["disabled"]
    );
    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}>
        <div className={modalClass}>
          <div className={styles["share_qrcode"]}>
            <div id="qrcode"></div>
          </div>
          <div className={styles["share_info"]}>
            <div className={styles["share_controller"]}>
              <Switcher id="switch" />
              <div className={styles["share_status"]}>已开启分享</div>
            </div>
            <blockquote>扫描二维码/复制链接<br/>分享你的 2016 github 总结</blockquote>
            <div className={styles["share_container"]}>
              <Input
                id="shareUrl"
                style="flat"
                value={`${window.location.origin}/github/${login}`}
              />
              <IconButton
                icon="clipboard"
                id="copyButton"
                onClick={this.copyUrl.bind(this)}
              />
            </div>
          </div>
        </div>
      </PortalModal>
    )
  }
}

export default ShareModal;

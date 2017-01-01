import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PortalModal from 'COMPONENTS/PortalModal';
import Input from 'COMPONENTS/Input';
import { GITHUB_GREEN_COLORS } from 'UTILS/colors';
import '../../styles/share_modal.css';

class ShareModal extends React.Component {
  componentDidMount() {
    const { login } = this.props;
    const qrcode = new QRCode(document.getElementById("qrcode"), {
      text: `http://192.168.1.7:3000/github/${login}`,
      width: 100,
      height: 100,
      colorDark : GITHUB_GREEN_COLORS[1],
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
  }

  render() {
    const { openModal, onClose, login } = this.props;
    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}>
        <div className="share_modal_container">
          <div className="share_qrcode">
            <div id="qrcode"></div>
          </div>
          <div className="share_info">
            <blockquote>扫描二维码分享你的 github 总结<br/>或者复制下面的链接转发</blockquote>
            <Input
              style="flat"
              disabled={true}
              value={`http://192.168.1.7:3000/github/${login}`}
            />
          </div>
        </div>
      </PortalModal>
    )
  }
}

export default ShareModal;

// function mapStateToProps(state) {
//   const {
//     user,
//     repos,
//     commitDatas,
//     reposLanguages
//   } = state.github;
//   return {
//     user,
//     reposLanguages,
//     commitDatas,
//     repos: repos.sort(sortRepos()),
//   };
// }
//
// export default connect(mapStateToProps)(ShareModal);

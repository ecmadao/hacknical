import React from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import cx from 'classnames';
import Clipboard from 'clipboard';
import { bindActionCreators } from 'redux';

import Loading from 'COMPONENTS/Loading';
import IconButton from 'COMPONENTS/IconButton';
import Switcher from 'COMPONENTS/Switcher';
import Input from 'COMPONENTS/Input';

import styles from '../styles/profile.css';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.copyUrl = this.copyUrl.bind(this);
  }

  copyUrl() {
    document.querySelector("#shareLink").select();
  }

  renderShareController() {
    const { actions, userInfo } = this.props;
    const { openShare, url } = userInfo;
    return (
      <div className={styles["share_controller"]}>
        <Switcher
          id="share_switch"
          onChange={actions.toggleShareStatus}
          checked={openShare}
        />
        <div className={styles["share_container"]}>
          <Input
            id="shareLink"
            style="flat"
            value={`${window.location.origin}/${url}`}
          />
          <IconButton
            icon="clipboard"
            id="copyLinkButton"
            onClick={this.copyUrl.bind(this)}
          />
        </div>
      </div>
    )
  }

  // componentDidUpdate(preProps) {
  //   const { loading } = this.props;
  //   if (!loading && preProps.loading) {
  //
  //   }
  // }

  componentDidMount() {
    const { actions } = this.props;
    actions.fetchGithubShareData();
    // this.renderQrcode();
    new Clipboard('#copyLinkButton', {
      text: () => $("#shareLink").val()
    });
  }

  render() {
    const { actions, loading } = this.props;
    return (
      <div>
        <div className={styles["card_container"]}>
          <p><i aria-hidden="true" className="fa fa-github"></i>&nbsp;&nbsp;github 分享数据</p>
          <div className={styles["card"]}>
            {loading ? (
              <Loading />
            ) : this.renderShareController()}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {...state.profile}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

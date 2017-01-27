import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { bindActionCreators } from 'redux';

import Loading from 'COMPONENTS/Loading';
import Button from 'COMPONENTS/Button';
import actions from '../redux/actions';
import styles from '../styles/setting.css';

class Setting extends React.Component {
  componentDidMount() {
    const { actions, loading } = this.props;
    loading && actions.fetchGithubUpdateTime();
  }

  render() {
    const { loading, updateTime } = this.props;
    return (
      <div>
        <div className={styles["card_container"]}>
          <p><i aria-hidden="true" className="fa fa-refresh"></i>&nbsp;&nbsp;github 数据更新</p>
          <div className={styles["card"]}>
            <div className={styles["info_container"]}>
              <div className={styles["info"]}>
                最近更新时间：{updateTime}
              </div>
              <Button
                style="flat"
                value="刷新数据"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {...state.setting}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Setting);

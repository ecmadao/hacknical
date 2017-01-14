import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

import Input from 'COMPONENTS/Input';
import Selector from 'COMPONENTS/Selector';
import actions from '../../redux/actions';
import { GENDERS } from '../../helper/const_value';
import styles from '../../styles/resume.css';

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.handleInfoChange = this.handleInfoChange.bind(this);
  }

  handleInfoChange(type) {
    const {actions} = this.props;
    return (value) => {
      actions.handleInfoChange({
        [type]: value
      });
    }
  }

  render() {
    const {
      email,
      phone,
      name,
      gender,
      location,
      intention,
      avator
    } = this.props;
    return (
      <div className={styles["resume_piece_container"]}>
        <div className={styles["resume_title"]}>
          基本信息
        </div>
        <div className={styles["resume_wrapper"]}>
          <Input
            value={name}
            placeholder="姓名"
            style="flat"
            onChange={this.handleInfoChange('name')}
          />
          <Selector
            value={gender}
            options={GENDERS}
            style="flat"
            onChange={this.handleInfoChange('gender')}
          />
        </div>
        <div className={styles["resume_wrapper"]}>
          <Input
            type="email"
            value={email}
            placeholder="邮箱"
            style="flat"
            onChange={this.handleInfoChange('email')}
          />
          <Input
            type="phone"
            value={phone}
            placeholder="电话"
            style="flat"
            formatType="phone"
            onChange={this.handleInfoChange('phone')}
          />
        </div>
        <div className={styles["resume_wrapper"]}>
          <Input
            value={intention}
            placeholder="意向职位"
            style="flat"
            onChange={this.handleInfoChange('intention')}
          />
          <Input
            value={location}
            placeholder="坐标"
            style="flat"
            onChange={this.handleInfoChange('location')}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { info } = state.resume;
  return { ...info }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);

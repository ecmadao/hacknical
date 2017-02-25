import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

import Input from 'COMPONENTS/Input';
import SelectorV2 from 'COMPONENTS/SelectorV2';
import actions from '../../redux/actions';
import { GENDERS } from 'SHAREDPAGE/datas/resume';
import styles from '../../styles/resume.css';
import locales from 'LOCALES';

const resumeTexts = locales("resume").sections.info;

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
          {resumeTexts.title}
        </div>
        <div className={styles["resume_wrapper"]}>
          <Input
            value={name}
            placeholder={resumeTexts.name}
            style="flat"
            onChange={this.handleInfoChange('name')}
          />
          <SelectorV2
            value={gender}
            options={GENDERS}
            theme="flat"
            onChange={this.handleInfoChange('gender')}
          />
        </div>
        <div className={styles["resume_wrapper"]}>
          <Input
            type="email"
            value={email}
            placeholder={resumeTexts.email}
            style="flat"
            onChange={this.handleInfoChange('email')}
          />
          <Input
            type="phone"
            value={phone}
            placeholder={resumeTexts.phone}
            style="flat"
            formatType="phone"
            onChange={this.handleInfoChange('phone')}
          />
        </div>
        <div className={styles["resume_wrapper"]}>
          <Input
            value={intention}
            placeholder={resumeTexts.job}
            style="flat"
            onChange={this.handleInfoChange('intention')}
          />
          <Input
            value={location}
            placeholder={resumeTexts.position}
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

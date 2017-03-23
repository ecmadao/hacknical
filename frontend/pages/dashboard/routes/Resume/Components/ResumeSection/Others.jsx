import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { Input } from 'light-ui';

import actions from '../../redux/actions';
import WritableList from 'COMPONENTS/WritableList';
import FormatInput from 'COMPONENTS/FormatInput';
import SocialLink from './SocialLink';
import styles from '../../styles/resume.css';
import locales from 'LOCALES';

const resumeTexts = locales("resume").sections.others;

class Others extends React.Component {
  constructor(props) {
    super(props);
    this.addSupplement = this.addSupplement.bind(this);
    this.deleteSupplement = this.deleteSupplement.bind(this);
    this.changeSupplement = this.changeSupplement.bind(this);
    this.handleOthersChange = this.handleOthersChange.bind(this);
    this.changeSocialLink = this.changeSocialLink.bind(this);
  }

  handleOthersChange(key) {
    const { actions } = this.props;
    return (value) => {
      actions.handleOthersInfoChange({[key]: value})
    }
  }

  addSupplement(value) {
    this.props.actions.addSupplement(value);
  }

  deleteSupplement(index) {
    this.props.actions.deleteSupplement(index);
  }

  changeSupplement(value, index) {
    this.props.actions.changeSupplement(value, index);
  }

  changeSocialLink(index) {
    return (value) => {
      this.props.actions.changeSocialLink(value, index);
    }
  }

  renderSocialLinks() {
    const { socialLinks } = this.props;
    return socialLinks.map((social, index) => {
      return (
        <SocialLink
          key={index}
          social={social}
          onChange={this.changeSocialLink(index)}
        />
      );
    });
  }

  render() {
    const {
      dream,
      expectSalary,
      expectPosition,
      supplements,
      expectLocation
    } = this.props;

    return (
      <div>
        <div className={styles["resume_piece_container"]}>
          <div className={styles["resume_title"]}>
            {resumeTexts.title}
          </div>
          <div className={styles["resume_wrapper"]}>
            <FormatInput
              value={expectSalary}
              placeholder={resumeTexts.expectSalary}
              formatType="number"
              theme="flat"
              id="input-expect-salary"
              onChange={this.handleOthersChange('expectSalary')}
            />
            <Input
              value={expectLocation}
              placeholder={resumeTexts.expectCity}
              theme="flat"
              onChange={this.handleOthersChange('expectLocation')}
            />
          </div>
          <div className={styles["resume_wrapper"]}>
            <Input
              value={dream}
              placeholder={resumeTexts.yourDream}
              theme="flat"
              onChange={this.handleOthersChange('dream')}
            />
          </div>
          <WritableList
            items={supplements}
            introText={resumeTexts.introText}
            onAdd={this.addSupplement}
            onDelete={this.deleteSupplement}
            onChange={this.changeSupplement}
            placeholder={resumeTexts.personalIntro}
          />
        </div>
        <div className={styles["resume_piece_container"]}>
          <div className={styles["resume_title"]}>
            {resumeTexts.links.title}
          </div>
          <div className={styles["resume_wrapper"]}>
            {this.renderSocialLinks()}
          </div>
        </div>
        <div/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { others } = state.resume;
  return { ...others }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Others);

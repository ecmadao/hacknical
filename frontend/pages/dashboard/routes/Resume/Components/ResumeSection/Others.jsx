import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input } from 'light-ui';
import resumeActions from '../../redux/actions';
import WritableList from 'COMPONENTS/WritableList';
import SocialLink from './SocialLink';
import styles from '../../styles/resume.css';
import locales from 'LOCALES';

const resumeTexts = locales('resume').sections.others;

class Others extends React.Component {
  constructor(props) {
    super(props);
    this.addSupplement = this.addSupplement.bind(this);
    this.deleteSupplement = this.deleteSupplement.bind(this);
    this.changeSupplement = this.changeSupplement.bind(this);
    this.handleOthersChange = this.handleOthersChange.bind(this);
    this.changeSocialLink = this.changeSocialLink.bind(this);
    this.deleteSocialLink = this.deleteSocialLink.bind(this);
  }

  handleOthersChange(key) {
    const { actions } = this.props;
    return (value) => {
      actions.handleOthersInfoChange({ [key]: value });
    };
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
    return (option) => {
      this.props.actions.changeSocialLink(option, index);
    };
  }

  deleteSocialLink(index) {
    return () => {
      this.props.actions.deleteSocialLink(index);
    };
  }

  renderSocialLinks() {
    const { actions, socialLinks } = this.props;
    const links = socialLinks.map((social, index) => (
      <SocialLink
        key={index}
        social={social}
        onChange={this.changeSocialLink(index)}
        onDelete={this.deleteSocialLink(index)}
      />
    ));
    links.push((
      <div
        key={links.length}
        onClick={actions.addSocialLink}
        className={styles.resume_link_new}
      >
        <img src={require('SRC/images/add.png')} alt="newLink" />
      </div>
    ));
    return links;
  }

  render() {
    const {
      dream,
      disabled,
      supplements,
      expectSalary,
      expectLocation,
    } = this.props;

    return (
      <div>
        <div className={styles.resume_piece_container}>
          <div className={styles.resume_title}>
            {resumeTexts.title}
          </div>
          <div className={styles.resume_wrapper}>
            <Input
              theme="flat"
              type="number"
              disabled={disabled}
              value={expectSalary}
              placeholder={resumeTexts.expectSalary}
              onChange={this.handleOthersChange('expectSalary')}
            />
            <Input
              theme="flat"
              disabled={disabled}
              value={expectLocation}
              placeholder={resumeTexts.expectCity}
              onChange={this.handleOthersChange('expectLocation')}
            />
          </div>
          <div className={styles.resume_wrapper}>
            <Input
              theme="flat"
              value={dream}
              disabled={disabled}
              placeholder={resumeTexts.yourDream}
              onChange={this.handleOthersChange('dream')}
            />
          </div>
          <WritableList
            items={supplements}
            onAdd={this.addSupplement}
            onDelete={this.deleteSupplement}
            onChange={this.changeSupplement}
            introText={resumeTexts.introText}
            placeholder={resumeTexts.personalIntro}
          />
        </div>
        <div className={styles.resume_piece_container}>
          <div className={styles.resume_title}>
            {resumeTexts.links.title}
          </div>
          <div className={styles.resumeLinks_wrapper}>
            {this.renderSocialLinks()}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { others } = state.resume;
  return { ...others };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(resumeActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Others);

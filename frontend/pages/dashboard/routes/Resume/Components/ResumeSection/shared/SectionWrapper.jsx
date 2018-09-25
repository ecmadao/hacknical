
import React from 'react';
import { Input, Button, AnimationComponent } from 'light-ui';
import cx from 'classnames';
import SectionTip from './SectionTip';
import locales from 'LOCALES';
import styles from '../../../styles/resume.css';

const resumeTexts = locales('resume');

class Wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      titleEditing: false
    };
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  onBlur() {
    this.setState({ titleEditing: false });
  }

  onFocus() {
    const { currentIndex } = this.props;
    this.setState({ titleEditing: true });
    setTimeout(() => $(`#section-${currentIndex}`).focus(), 200);
  }

  onTitleChange(newTitle) {
    const { titleEditing } = this.state;
    const { title, titleEditable, onTitleChange } = this.props;
    titleEditing && titleEditable && onTitleChange && onTitleChange(title, newTitle);
  }

  render() {
    const {
      title,
      status,
      onExit,
      children,
      maxIndex,
      editButton,
      currentIndex,
      onTransitionEnd,
      onSectionChange,
      titleEditable = false,
    } = this.props;
    const { titleEditing } = this.state;

    const onStepChange = (step) => {
      const callback = () => onSectionChange && onSectionChange(step);
      onExit && onExit(callback);
    };

    return (
      <div
        className={cx(
          styles.resume_sections,
          styles[`resume_sections-${status}`]
        )}
        onTransitionEnd={onTransitionEnd}
      >
        <div className={styles.resume_section_container}>
          <div className={styles.section_title}>
            <Input
              value={title}
              onBlur={this.onBlur}
              onChange={this.onTitleChange}
              id={`section-${currentIndex}`}
              className={styles.sectionTitleInput}
              theme={titleEditing ? 'flat' : 'ghost'}
              disabled={!titleEditable || !titleEditing}
              style={{ width: `${title.length * 12 + 10}px`}}
            />
            &nbsp;
            <SectionTip {...this.props} />
            {titleEditable && (
              <div className={styles.sectionTitleEdit}>
                <i
                  aria-hidden="true"
                  onClick={this.onFocus}
                  className="fa fa-pencil"
                />
              </div>
            )}
          </div>
          <div>
            {children}
          </div>
          {editButton && (
            <div className={styles.resume_button_container}>
              <Button
                theme="flat"
                value={this.props.button}
                disabled={this.props.disabled}
                leftIcon={(
                  <i className="fa fa-plus-circle" aria-hidden="true" />
                )}
                onClick={this.props.onClick}
              />
            </div>
          )}
        </div>
        <div className={cx(styles.resume_operations, styles.bottom)}>
          <div className={styles.operations_wrapper}>
            {currentIndex > 0 && (
              <Button
                value={resumeTexts.buttons.pre}
                color="dark"
                className={styles.operation}
                onClick={() => onStepChange(currentIndex - 1)}
                leftIcon={(
                  <i className="fa fa-angle-left" aria-hidden="true" />
                )}
              />
            )}
            {currentIndex < maxIndex - 1 && (
              <Button
                value={resumeTexts.buttons.next}
                className={styles.operation}
                onClick={() => onStepChange(currentIndex + 1)}
                rightIcon={(
                  <i className="fa fa-angle-right" aria-hidden="true" />
                )}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const SectionWrapper = props => (
  <AnimationComponent>
    <Wrapper {...props} />
  </AnimationComponent>
);

SectionWrapper.defaultProps = {
  section: 'info',
  editButton: false,
  maxIndex: 1,
  currentIndex: 0,
  title: '',
  children: null,
  button: '',
  disabled: false,
  onClick: Function.prototype,
  onSectionChange: Function.prototype,
};

export default SectionWrapper;

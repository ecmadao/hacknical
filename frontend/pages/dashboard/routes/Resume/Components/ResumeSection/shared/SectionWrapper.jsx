
import React from 'react'
import { Input, Button, IconButton, AnimationComponent } from 'light-ui'
import cx from 'classnames'
import SectionTip from './SectionTip'
import locales from 'LOCALES'
import styles from '../../../styles/resume.css'
import Icon from 'COMPONENTS/Icon'

const resumeTexts = locales('resume')

class Wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      titleEditing: false
    };
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
  }

  onBlur() {
    this.setState({ titleEditing: false });
  }

  onFocus() {
    const { currentIndex } = this.props;
    this.setState({ titleEditing: true });
    setTimeout(() => $(`#section-${currentIndex}`).focus(), 200);
  }

  onKeyDown(e) {
    if (e.keyCode !== 13) return;
    this.onBlur();
  }

  onDelete() {
    const { onDelete } = this.props;
    onDelete && onDelete();
  }

  onTitleChange(newTitle) {
    const { titleEditing } = this.state;
    const { title, editable, onTitleChange } = this.props;
    titleEditing && editable && onTitleChange && onTitleChange(title, newTitle);
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
      editable = false,
      deletable = false,
    } = this.props;
    const { titleEditing } = this.state;

    const onStepChange = (step) => {
      let index = step
      if (step < 0) index = 0
      if (step > maxIndex - 1) index = maxIndex - 1
      const callback = () => onSectionChange && onSectionChange(index)
      onExit && onExit(callback)
    }

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
              onKeyDown={this.onKeyDown}
              onChange={this.onTitleChange}
              id={`section-${currentIndex}`}
              className={styles.sectionTitleInput}
              theme={titleEditing ? 'flat' : 'ghost'}
              disabled={!editable || !titleEditing}
              style={{ width: `${title.length * 12 + 10}px`}}
            />
            &nbsp;
            <SectionTip {...this.props} />
            {editable && (
              <IconButton
                color="gray"
                icon="pencil"
                onClick={this.onFocus}
                className={styles.sectionOperationButton}
              />
            )}
            {deletable && (
              <div className={styles.sectionOperationRight}>
                <IconButton
                  color="red"
                  icon="trash-o"
                  onClick={this.onDelete}
                  className={styles.sectionOperationButton}
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
                  <Icon icon="plus-circle" />
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
                  <Icon icon="angle-left" />
                )}
              />
            )}
            {currentIndex < maxIndex - 1 && (
              <Button
                value={resumeTexts.buttons.next}
                className={styles.operation}
                onClick={() => onStepChange(currentIndex + 1)}
                rightIcon={(
                  <Icon icon="angle-right" />
                )}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

const SectionWrapper = props => (
  <AnimationComponent>
    <Wrapper {...props} />
  </AnimationComponent>
)

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
  onSectionChange: Function.prototype
}

export default SectionWrapper

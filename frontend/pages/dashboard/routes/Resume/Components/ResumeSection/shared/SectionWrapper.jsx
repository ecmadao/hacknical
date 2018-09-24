
import React from 'react';
import { Button, AnimationComponent } from 'light-ui';
import cx from 'classnames';
import SectionTip from './SectionTip';
import locales from 'LOCALES';
import styles from '../../../styles/resume.css';

const resumeTexts = locales('resume');

const Wrapper = (props) => {
  const { onSectionChange, onExit, title } = props;
  const onStepChange = (step) => {
    const callback = () => onSectionChange && onSectionChange(step);
    onExit && onExit(callback);
  };

  return (
    <div
      className={cx(
        styles.resume_sections,
        styles[`resume_sections-${props.status}`]
      )}
      onTransitionEnd={props.onTransitionEnd}
    >
      <div className={styles.resume_section_container}>
        <div className={styles.section_title}>
          {title}
          &nbsp;
          <SectionTip {...props} />
        </div>
        <div>
          {props.children}
        </div>
        {props.editButton && (
          <div className={styles.resume_button_container}>
            <Button
              theme="flat"
              value={props.button}
              disabled={props.disabled}
              leftIcon={(
                <i className="fa fa-plus-circle" aria-hidden="true" />
              )}
              onClick={props.onClick}
            />
          </div>
        )}
      </div>
      <div className={cx(styles.resume_operations, styles.bottom)}>
        <div className={styles.operations_wrapper}>
          {props.currentIndex > 0 && (
            <Button
              value={resumeTexts.buttons.pre}
              color="dark"
              className={styles.operation}
              onClick={() => onStepChange(props.currentIndex - 1)}
              leftIcon={(
                <i className="fa fa-angle-left" aria-hidden="true" />
              )}
            />
          )}
          {props.currentIndex < props.maxIndex - 1 && (
            <Button
              value={resumeTexts.buttons.next}
              className={styles.operation}
              onClick={() => onStepChange(props.currentIndex + 1)}
              rightIcon={(
                <i className="fa fa-angle-right" aria-hidden="true" />
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};

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

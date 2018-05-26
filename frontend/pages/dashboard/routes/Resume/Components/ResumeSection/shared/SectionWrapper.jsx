
import React from 'react';
import { Button } from 'light-ui';
import SectionTip from './SectionTip';
import styles from '../../../styles/resume.css';

const SectionWrapper = props => (
  <div className={styles.resume_section_container}>
    <div className={styles.section_title}>
      {props.title}
      &nbsp;
      <SectionTip {...props} />
    </div>
    <div>
      {props.children}
    </div>
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
  </div>
);

SectionWrapper.defaultProps = {
  title: '',
  children: null,
  button: '',
  disabled: false,
  onClick: () => {}
};

export default SectionWrapper;

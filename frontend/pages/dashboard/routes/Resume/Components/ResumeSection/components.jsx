import React from 'react';
import cx from 'classnames';
import { Input, Button } from 'light-ui';
import styles from '../../styles/resume.css';

export const TipsoInput = (props) => {
  const {
    type,
    value,
    required,
    placeholder,
    onChange,
    className,
    disabled = false
  } = props;
  return (
    <div className={styles["project_link_wrapper"]}>
      <i className="fa fa-link" aria-hidden="true"></i>
      &nbsp;&nbsp;
      <Input
        value={value}
        type={type}
        disabled={disabled}
        required={required}
        theme="borderless"
        subTheme="underline"
        className={cx(
          styles['tipso_input'],
          className
        )}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  )
};

TipsoInput.defaultProps = {
  value: '',
  type: 'url',
  required: false,
  placeholder: '',
  className: '',
  onChange: () => {},
  disabled: false,
};

export const SectionWrapper = (props) => {
  return (
    <div className={styles["resume_section_container"]}>
      <div className={styles["section_title"]}>
        {props.title}
      </div>
      <div>
        {props.children}
      </div>
      <div className={styles["resume_button_container"]}>
        <Button
          theme="flat"
          value={props.button}
          disabled={props.disabled}
          leftIcon={(
            <i className="fa fa-plus-circle" aria-hidden="true"></i>
          )}
          onClick={props.onClick}
        />
      </div>
    </div>
  );
};

SectionWrapper.defaultProps = {
  title: '',
  children: null,
  button: '',
  disabled: false,
  onClick: () => {}
};

import React from 'react';
import cx from 'classnames';
import { Input, Button } from 'light-ui';
import styles from '../../styles/resume.css';

export const TipsoInputs = (props) => {
  const {
    children,
    prefixIcons,
  } = props;

  const inputs = [];
  children.forEach((child, i) => {
    let prefix = null;
    if (prefixIcons[i]) {
      prefix = (
        <i className={`fa fa-${prefixIcons[i]}`} aria-hidden="true" />
      );
    }
    inputs.push((
      <div className={styles.tipsoInput} key={i}>
        {prefix}
        {child}
      </div>
    ));
  });

  return (
    <div className={styles.project_link_wrapper}>
      {inputs}
    </div>
  );
};

export const TipsoInput = (props) => {
  const {
    type,
    value,
    required,
    onChange,
    className,
    placeholder,
    disabled = false,
    prefixIcons = ['link'],
  } = props;
  return (
    <TipsoInputs prefixIcons={prefixIcons}>
      {[
        <Input
          key="0"
          type={type}
          value={value}
          disabled={disabled}
          required={required}
          onChange={onChange}
          theme="borderless"
          subTheme="underline"
          className={cx(
            styles.tipso_input,
            className
          )}
          placeholder={placeholder}
        />
      ]}
    </TipsoInputs>
  );
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

export const SectionWrapper = props => (
  <div className={styles.resume_section_container}>
    <div className={styles.section_title}>
      {props.title}
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

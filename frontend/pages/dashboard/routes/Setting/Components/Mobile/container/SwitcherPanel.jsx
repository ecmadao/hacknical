
import React from 'react';
import cx from 'classnames';
import { Switcher, AnimationComponent } from 'light-ui';
import styles from '../styles/setting.css';
import panelStyles from '../styles/panel.css';

const SwitcherPane = (props) => {
  const {
    text,
    status,
    checked,
    onChange,
    className,
    onTransitionEnd,
    disabled = false
  } = props;
  return (
    <div
      className={cx(
        styles.itemPane,
        panelStyles.panel,
        panelStyles[`panel-${status}`],
        className
      )}
      onTransitionEnd={onTransitionEnd}
    >
      <div className={styles.paneTextContainer}>
        {text}
      </div>
      <Switcher
        size="small"
        version="v3"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
    </div>
  );
};

const SwitcherPanel = props => (
  <AnimationComponent>
    <SwitcherPane {...props} />
  </AnimationComponent>
);

export default SwitcherPanel;

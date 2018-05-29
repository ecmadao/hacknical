

import React from 'react';
import cx from 'classnames';
import styles from '../styles/setting.css';
import { AnimationComponent } from 'light-ui';
import sharedStyles from 'SHARED/styles/mobile.css';
import panelStyles from '../styles/panel.css';


const SettingPane = (props) => {
  const {
    title,
    status,
    children,
    onTransitionEnd,
    sectionClassName = '',
  } = props;
  return (
    <div className={styles.paneContainer}>
      <div className={styles.paneHeader}>
        {title}
      </div>
      <div
        className={cx(
          sharedStyles.mobile_card,
          styles.settingSection,
          panelStyles.panel,
          panelStyles[`panel-${status}`],
          sectionClassName
        )}
        onTransitionEnd={onTransitionEnd}
      >
        {children}
      </div>
    </div>
  );
};

const SettingPanel = props => (
  <AnimationComponent>
    <SettingPane {...props} />
  </AnimationComponent>
);


export default SettingPanel;

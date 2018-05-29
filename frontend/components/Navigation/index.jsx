
import React from 'react';
import cx from 'classnames';
import { AnimationComponent } from 'light-ui';
import styles from './navigation.css';

const Nav = (props) => {
  const {
    id,
    status,
    sections,
    activeSection,
    onTransitionEnd,
    handleSectionChange
  } = props;

  const navs = sections.map((section, index) => {
    const { id, text } = section;
    const sectionClass = cx(
      styles.section,
      activeSection === id && styles.active
    );
    return (
      <div className={sectionClass} key={index}>
        <div
          className={styles.sectionWrapper}
          onClick={() => handleSectionChange(id)}
        >
          {text}
        </div>
      </div>
    );
  });

  return (
    <div
      id={id}
      className={cx(
        styles.navigation,
        styles[`navigation-${status}`]
      )}
      onTransitionEnd={onTransitionEnd}
    >
      {navs}
    </div>
  );
};

const Navigation = props => (
  <AnimationComponent>
    <Nav {...props} />
  </AnimationComponent>
);

export default Navigation;

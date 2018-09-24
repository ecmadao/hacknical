
import React from 'react';
import cx from 'classnames';
import { AnimationComponent } from 'light-ui';
import styles from './navigation.css';

class Nav extends React.PureComponent {
  componentDidMount() {
    if (this.props.fixed) {
      const $navigation = $('#resume_navigation');
      const navTop = 200;
      const $document = $(document);

      $(window).scroll(() => {
        const currentTop = $document.scrollTop();
        if (currentTop + 80 + 65 >= navTop) {
          const navLeft = $navigation.offset().left;
          $navigation.css({
            position: 'fixed',
            left: navLeft,
            top: 80
          });
        } else {
          $navigation.css({
            position: 'absolute',
            left: -120,
            top: 63
          });
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { sections, currentIndex, activeSection } = this.props;
    if (activeSection !== prevProps.activeSection) {
      const $dom = $(`.${styles.navWrapper}`);
      if (!$dom) return;
      const height = $dom.height();
      $dom.scrollTop(height / sections.length * currentIndex);
    }
  }

  render() {
    const {
      id,
      status,
      sections,
      tail = null,
      activeSection,
      onTransitionEnd,
      handleSectionChange
    } = this.props;

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
        <div className={styles.navWrapper}>
          {navs}
        </div>
        {tail}
      </div>
    );
  }
}

const Navigation = props => (
  <AnimationComponent>
    <Nav {...props} />
  </AnimationComponent>
);

export default Navigation;

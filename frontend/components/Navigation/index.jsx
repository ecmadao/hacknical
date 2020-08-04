
import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { AnimationComponent, ClassicCard } from 'light-ui'
import styles from './navigation.css'

class Nav extends React.PureComponent {
  componentDidMount() {
    if (this.props.fixed) {
      const $navigation = $(`#${this.props.id}`)
      const navTop = 200
      const $document = $(document)

      $(window).scroll(() => {
        const currentTop = $document.scrollTop()
        if (currentTop + 80 + 65 >= navTop) {
          const navLeft = $navigation.offset().left
          $navigation.css({
            position: 'fixed',
            left: navLeft,
            top: 80
          })
        } else {
          $navigation.css({
            position: 'absolute',
            left: -120,
            top: 63
          })
        }
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { sections, currentIndex, activeSection } = this.props
    if (activeSection !== prevProps.activeSection) {
      const $dom = $(`.${styles.navWrapper}`)
      if (!$dom) return

      const height = $dom.height()
      $dom.scrollTop(height / sections.length * currentIndex)
    }
  }

  render() {
    const {
      id,
      status,
      sections,
      children = null,
      tail = null,
      activeSection,
      onTransitionEnd,
      handleSectionChange,
      navigationCardClassName,
      navigationCardBgClassName,
    } = this.props

    const navs = sections.map((section, index) => {
      const { id, text } = section
      const sectionClass = cx(
        styles.section,
        activeSection === id && styles.active
      )
      return (
        <div className={sectionClass} key={index}>
          <div
            className={styles.sectionWrapper}
            onClick={() => handleSectionChange(id)}
          >
            {text}
          </div>
        </div>
      )
    })

    return (
      <div
        id={id}
        className={cx(
          styles.navigation,
          styles[`navigation-${status}`],
        )}
        onTransitionEnd={onTransitionEnd}
      >
        <ClassicCard
          hoverable={false}
          className={cx(styles.navigationCard, navigationCardClassName)}
          bgClassName={cx(styles.navigationCardBg, navigationCardBgClassName)}
        >
          {children || (
            <div className={styles.navWrapper}>
              {navs}
            </div>
          )}
          {tail}
        </ClassicCard>
      </div>
    )
  }
}

const Navigation = props => (
  <AnimationComponent>
    <Nav {...props} />
  </AnimationComponent>
)

Navigation.propTypes = {
  sections: PropTypes.array,
  navigationCardClassName: PropTypes.string,
  navigationCardBgClassName: PropTypes.string,
}

Navigation.defaultProps = {
  sections: [],
  children: null,
  navigationCardClassName: '',
  navigationCardBgClassName: ''
}

export default Navigation


import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import styles from './nav.css'
import locales, { getLocale } from 'LOCALES'
import Navigation from 'COMPONENTS/Navigation'
import DragAndDrop from 'COMPONENTS/DragAndDrop'
import message from 'UTILS/message'

const settingTexts = locales('dashboard.setting')

class DragableNavigation extends React.Component {
  constructor(props) {
    super(props)

    this.handleItemClick = this.handleItemClick.bind(this)
    this.handleSectionsReorder = this.handleSectionsReorder.bind(this)
    this.handleSectionChange = this.handleSectionChange.bind(this)
  }

  handleSectionsReorder(order) {
    const { source, destination } = order

    const fromIndex = source.index
    const toIndex = destination.index
    if (toIndex === fromIndex) return
    if (fromIndex % 2 === 1) return

    const { sections, onReorder } = this.props

    const realFromIndex = Math.floor(fromIndex / 2)
    const realToIndex = realFromIndex + Math.floor((toIndex - fromIndex) / 2)

    if (realFromIndex === realToIndex) return

    if (sections[realFromIndex].disabled) {
      message.error(settingTexts.order.orderingError)
      return
    }
    for (let i = realFromIndex - 1; i >= realToIndex; i -= 1) {
      if (sections[i].disabled) {
        message.error(settingTexts.order.orderingFixedError)
        return
      }
    }

    const newSections = [...sections]
    const [section] = newSections.splice(realFromIndex, 1)
    newSections.splice(realToIndex, 0, section)

    onReorder && onReorder(newSections)
  }

  handleSectionChange(id) {
    const { onActiveChange } = this.props

    return () => {
      window.location.href = [
        window.location.origin,
        window.location.pathname,
        window.location.search,
        `#${id}`
      ].join('')

      onActiveChange && onActiveChange(id)
    }
  }

  handleItemClick(index) {
    if (index % 2 === 1) return

    const { sections } = this.props
    const realIndex = index / 2
    if (!sections[realIndex]) return

    this.handleSectionChange(sections[realIndex].id)()
  }

  render() {
    const {
      id,
      tail,
      disabled,
      sections,
      activeSection,
      dragableSectionClassName,
    } = this.props

    return (
      <Navigation
        fixed
        id={id}
        tail={tail}
        navigationCardClassName={styles.navigationCard}
        navigationCardBgClassName={styles.navigationCardBg}
      >
        <DragAndDrop
          disabled={disabled}
          onItemClick={this.handleItemClick}
          onDragEnd={this.handleSectionsReorder}
          containerClassName={styles.dragableWrapper}
        >
          {sections.reduce((list, section, index) => {
            list.push({
              id: section.id,
              itemClassName: cx(
                styles.dragableSection,
                dragableSectionClassName,
                getLocale() === 'en' && styles.wide,
                activeSection === section.id && styles.active
              ),
              disabled: section.disabled,
              Component: (
                <div
                  key={`${section.id}-${index}`}
                  className={styles.navSectionWrapper}
                  onClick={this.handleSectionChange(section.id)}
                >
                  {section.title}
                </div>
              )
            })

            if (index < sections.length - 1) {
              list.push({
                id: `${section.id}-divisive`,
                disabled: true,
                itemClassName: styles.dragableSectionDivisive,
                Component: (
                  <div key={`${section.id}-${index}-divisive`}></div>
                )
              })
            }

            return list
          }, [])}
        </DragAndDrop>
      </Navigation>
    )
  }
}

DragableNavigation.propTypes = {
  onReorder: PropTypes.func,
  onActiveChange: PropTypes.func,
  sections: PropTypes.array,
  activeSection: PropTypes.string,
  id: PropTypes.string,
  dragableSectionClassName: PropTypes.string,
  disabled: PropTypes.bool
}

DragableNavigation.defaultProps = {
  onReorder: Function.prototype,
  onActiveChange: Function.prototype,
  sections: [],
  activeSection: null,
  id: '',
  dragableSectionClassName: '',
  disabled: false,
}

export default DragableNavigation

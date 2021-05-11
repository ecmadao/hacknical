import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Label, InputGroup } from 'light-ui'
import styles from './labels.css'
import DragAndDrop from 'COMPONENTS/DragAndDrop'

class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.onDelete = this.onDelete.bind(this)
    this.onReorder = this.onReorder.bind(this)
  }

  onDelete(index) {
    const { onDelete } = this.props
    return () => {
      onDelete && onDelete(index)
    }
  }

  onReorder(order) {
    const fromIndex = order.source.index
    const toIndex = order.destination.index

    if (toIndex === fromIndex) return

    const { labels, onReorder } = this.props
    if (!onReorder) return

    const [label] = labels.splice(fromIndex, 1)
    labels.splice(toIndex, 0, label)

    onReorder(labels)
  }

  renderLabels() {
    const { labels, disabled } = this.props

    return (
      <DragAndDrop
        direction="horizontal"
        onDragEnd={this.onReorder}
        containerClassName={styles.droppable_horizontal}>
        {
          labels.map((label, index) => ({
            id: label,
            itemClassName: styles.draggable_horizontal,
            Component: (
              <Label
                key={index}
                text={label}
                color="darkLight"
                deleteable
                disabled={disabled}
                clickable={false}
                className={styles.label}
                onDelete={this.onDelete(index)}
              />
            )
          }))
        }
      </DragAndDrop>
    )
  }

  render() {
    const {
      max,
      value,
      labels,
      introText,
      disabled,
      onKeyDown,
      onChange,
      placeholder,
      className
    } = this.props

    return (
      <div className={cx(styles.labelsWrapper, className)}>
        {this.renderLabels()}
        {labels.length < max ? (
          <div className={styles.inputWrapper}>
            <InputGroup
              value={value}
              required={false}
              theme="borderless"
              subTheme="underline"
              placeholder={placeholder}
              onChange={onChange}
              onKeyDown={onKeyDown}
              disabled={disabled}
              wrapperClassName={styles.wrapper}
              tipsoTheme="dark"
              tipsoPosition="bottom"
              tipsoStyle={{
                left: '0',
                transform: 'translateX(0) translateY(7px)'
              }}
              inputClassName={styles.input}
            >
              <div className={styles.intro}>
                {introText}
              </div>
            </InputGroup>
          </div>
        ) : null}
      </div>
    )
  }
}

Wrapper.propTypes = {
  introText: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  labels: PropTypes.array,
  onDelete: PropTypes.func,
  onReorder: PropTypes.func,
  max: PropTypes.number
}

Wrapper.defaultProps = {
  labels: [],
  max: 10,
  introText: '',
  placeholder: '',
  className: '',
  onDelete: Function.prototype,
  onReorder: Function.prototype,
}

export default Wrapper

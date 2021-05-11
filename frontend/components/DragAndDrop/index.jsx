
import React from "react"
import cx from 'classnames'
import PropTypes from 'prop-types'
import styles from './dad.css'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

class DragAndDrop extends React.Component {
  constructor(props) {
    super(props)
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  onDragEnd(order) {
    const { onDragEnd, onMoveEnd } = this.props

    const { source, destination, draggableId } = order

    // dropped outside the list
    if (!destination) return

    if (source.droppableId === destination.droppableId) {
      return onDragEnd && onDragEnd({ source, destination, draggableId })
    } else {
      return onMoveEnd && onMoveEnd({ source, destination, draggableId })
    }
  }

  render() {
    const {
      disabled,
      children,
      direction,
      onItemClick,
      droppableId,
      itemClassName,
      containerClassName,
    } = this.props

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId={droppableId} isDropDisabled={disabled} direction={direction}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cx(
                styles.droppable_container,
                snapshot.isDraggingOver && snapshot.dragging,
                direction === "horizontal" && styles.horizontal,
                containerClassName
              )}
            >
              {children.map((child, index) => (
                <Draggable
                  key={child.id}
                  draggableId={child.id}
                  index={index}
                  isDragDisabled={disabled || child.disabled}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}
                      className={cx(
                        styles.draggable_item,
                        snapshot.isDragging && snapshot.dragging,
                        itemClassName,
                        child.itemClassName
                      )}
                      onClick={() => onItemClick(index)}
                    >
                      {child.Component}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

DragAndDrop.propTypes = {
  onDrop: PropTypes.func,
  onMoveEnd: PropTypes.func,
  onDragEnd: PropTypes.func,
  onItemClick: PropTypes.func,
  children: PropTypes.array,
  disabled: PropTypes.bool,
  droppableId: PropTypes.string,
  direction: PropTypes.string,
  itemClassName: PropTypes.string,
  containerClassName: PropTypes.string
}

DragAndDrop.defaultProps = {
  onDrop: Function.prototype,
  onDragEnd: Function.prototype,
  onMoveEnd: Function.prototype,
  onItemClick: Function.prototype,
  children: [],
  disabled: false,
  itemClassName: '',
  containerClassName: '',
  direction: 'vertical',
  droppableId: 'droppableId'
}

export default DragAndDrop;

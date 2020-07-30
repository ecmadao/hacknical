
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

    const { source, destination } = order

    // dropped outside the list
    if (!destination) return

    if (source.droppableId === destination.droppableId) {
      return onDragEnd({ source, destination })
    } else {
      return onMoveEnd({ source, destination })
    }
  }

  render() {
    const {
      children,
      droppableId,
      itemClassName,
      containerClassName,
    } = this.props

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cx(
                styles.droppable_container,
                snapshot.isDraggingOver && snapshot.dragging,
                containerClassName
              )}
            >
              {children.map((child, index) => (
                <Draggable key={child.id} draggableId={child.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}
                      className={cx(
                        styles.droppable_item,
                        snapshot.isDragging && snapshot.dragging,
                        itemClassName
                      )}
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
  children: PropTypes.array,
  droppableId: PropTypes.string,
  itemClassName: PropTypes.string,
  containerClassName: PropTypes.string
}

DragAndDrop.defaultProps = {
  onDrop: Function.prototype,
  onMoveEnd: Function.prototype,
  children: [],
  itemClassName: '',
  containerClassName: '',
  droppableId: 'droppableId'
}

export default DragAndDrop;


import React from "react"
import cx from 'classnames'
import PropTypes from 'prop-types'
import styles from './dad.css'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

class DragAndDrop extends React.Component {
  render() {
    const {
      children,
      onDragEnd,
      itemClassName,
      containerClassName,
    } = this.props

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
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
  children: PropTypes.array,
  itemClassName: PropTypes.string,
  containerClassName: PropTypes.string
}

DragAndDrop.defaultProps = {
  onDrop: Function.prototype,
  children: [],
  itemClassName: '',
  containerClassName: ''
}

export default DragAndDrop;

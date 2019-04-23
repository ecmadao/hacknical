
import React from 'react'
import objectAssign from 'UTILS/object-assign'
import WritableGroupWrapper from '../shared/WritableGroupWrapper'
import Wrapper from './Wrapper'

const WritableList = (props) => {
  const wrapperProps = objectAssign({}, props)
  delete wrapperProps.onAdd
  delete wrapperProps.onChange
  wrapperProps.onLabelChange = props.onChange

  return (
    <WritableGroupWrapper onAdd={props.onAdd}>
      <Wrapper {...wrapperProps} />
    </WritableGroupWrapper>
  )
}

export default WritableList

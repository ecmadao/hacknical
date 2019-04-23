
import React from 'react'
import Icon from 'COMPONENTS/Icon'

const SelectedRepos = (props) => {
  const { name, language, onRemove } = props
  return (
    <div className="selected_repos">
      <Icon icon="times-circle" onClick={() => onRemove(name)} />
      {name}
      <br />
      <span>{language}</span>
    </div>
  )
}

export default SelectedRepos

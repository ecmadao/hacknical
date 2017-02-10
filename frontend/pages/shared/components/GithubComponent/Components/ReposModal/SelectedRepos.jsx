import React from 'react';

class SelectedRepos extends React.Component {
  render() {
    const { name, id, language, onRemove } = this.props;
    return (
      <div className="selected_repos">
        <i
          aria-hidden="true"
          onClick={() => onRemove(id)}
          className="fa fa-times-circle"></i>
        {name}<br/>
        <span>{language}</span>
      </div>
    )
  }
}

export default SelectedRepos;

import React from 'react';

const SelectedRepos = (props) => {
  const { name, language, onRemove } = props;
  return (
    <div className="selected_repos">
      <i
        aria-hidden="true"
        onClick={() => onRemove(name)}
        className="fa fa-times-circle"
      />
      {name}
      <br />
      <span>{language}</span>
    </div>
  );
};

export default SelectedRepos;

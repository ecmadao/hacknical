import React from 'react';
import './loading.css';

const Loading = (props) => {
  return (
    <div className="loading_container">
      <div className="bounce_wrapper">
        <div className="loading_bounce"></div>
        <div className="loading_bounce"></div>
      </div>
    </div>
  )
}

export default Loading;

import React, { PropTypes } from 'react';
import GithubSection from './GithubSection';


const Github = (isShare) => (props) => <GithubSection isShare={isShare} {...props} />

export default Github;

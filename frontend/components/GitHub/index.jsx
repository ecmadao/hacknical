
import React from 'react';
import GitHubSection from './GithubSection';
import AnimationComponent from 'COMPONENTS/AnimationComponent';

const GitHub = props => (
  <AnimationComponent>
    <GitHubSection {...props} />
  </AnimationComponent>
);

export default GitHub;

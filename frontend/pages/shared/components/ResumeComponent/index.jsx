import React from 'react';
import ResumeComponentV1 from './v1';
import ResumeComponentV2 from './v2';

const ResumeViews = {
  v1: ResumeComponentV1,
  v2: ResumeComponentV2,
};

const ResumeComponent = (props) => {
  const { shareInfo } = props;
  const ResumeView = ResumeViews[shareInfo.template];
  if (!ResumeView) return null;
  return (
    <ResumeView
      {...props}
    />
  );
};

ResumeComponent.defaultProps = {
  resume: {},
  shareInfo: {},
  login: '',
  viewId: 'v0',
};

export default ResumeComponent;

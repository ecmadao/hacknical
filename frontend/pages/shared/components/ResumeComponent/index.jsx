import React, { PropTypes } from 'react';
import ResumeComponentV1 from './v1';
import ResumeComponentV2 from './v2';

const ResumeViews = {
  v1: ResumeComponentV1,
  v2: ResumeComponentV2,
};

const ResumeComponent = (props) => {
  const { shareInfo } = props;
  const ResumeView = ResumeViews[shareInfo.template];
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
  viewId: 'v2',
};

export default ResumeComponent;

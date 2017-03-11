import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import PATH from '../../../shared/path';

const Tab = (props) => {
  const { onChange, tab } = props;
  const { id, name, icon, enable } = tab;
  const tabClass = cx(
    "app_tab",
    enable && "enable"
  );

  return (
    <Link
      to={`${PATH.BASE_PATH}/${id}`}
      className={tabClass}
      activeClassName="app_tab_active"
      onClick={(e) => onChange(e, id, enable)}>
      <i aria-hidden="true" className={`fa ${icon}`}></i>&nbsp;
      {name}
    </Link>
  )
};

export default Tab;

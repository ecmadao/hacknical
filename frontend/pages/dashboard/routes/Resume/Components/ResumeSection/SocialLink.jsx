import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import { Input, Tipso } from 'light-ui';

import validator from 'UTILS/validator';
import styles from '../../styles/resume.css';

const SocialLink = (props) => {
  const { onChange, social } = props;
  const { icon, name, url, text } = social;

  return (
    <Tipso
      trigger="click"
      tipsoContent={(
        <div className={styles["project_link_wrapper"]}>
          <i className="fa fa-link" aria-hidden="true"></i>
          &nbsp;&nbsp;
          <Input
            value={url}
            type="url"
            theme="borderless"
            style="underline"
            placeholder={`Add ${text || name} link`}
            onChange={onChange}
          />
        </div>
      )}>
      <div
        className={styles["resume_link"]}>
        <img src={require(`SRC/images/${icon}`)} alt={name}/>
      </div>
    </Tipso>
  )
};

export default SocialLink

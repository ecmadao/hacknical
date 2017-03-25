import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import { Input, Tipso } from 'light-ui';
import validator from 'UTILS/validator';
import styles from '../../styles/resume.css';

const SocialLink = (props) => {
  const { onChange, social } = props;
  const { icon, name, url, text } = social;
  const itemClass = cx(
    styles["resume_link"],
    validator.url(url) && styles["active"]
  );

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
            subTheme="underline"
            className={styles['tipso_input']}
            placeholder={`Add ${text || name} link`}
            onChange={onChange}
          />
        </div>
      )}>
      <div
        className={itemClass}>
        <img src={require(`SRC/images/${icon}`)} alt={name}/>
      </div>
    </Tipso>
  )
};

export default SocialLink

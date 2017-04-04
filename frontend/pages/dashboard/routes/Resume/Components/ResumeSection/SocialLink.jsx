import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import { Tipso } from 'light-ui';
import validator from 'UTILS/validator';
import styles from '../../styles/resume.css';
import { TipsoInput } from './components';

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
        <TipsoInput
          value={url}
          required={true}
          placeholder={`Add ${text || name} link`}
          onChange={onChange}
        />
      )}>
      <div
        className={itemClass}>
        <img src={require(`SRC/images/${icon}`)} alt={name}/>
      </div>
    </Tipso>
  )
};

export default SocialLink

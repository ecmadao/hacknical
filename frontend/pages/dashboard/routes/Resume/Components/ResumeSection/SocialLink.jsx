/* eslint global-require: "off" */

import React from 'react';
import cx from 'classnames';
import { Tipso, Input } from 'light-ui';
import validator from 'UTILS/validator';
import styles from '../../styles/resume.css';
import { TipsoInputs } from './components';
import locales from 'LOCALES';

const resumeTexts = locales('resume').sections.others;

const renderTipsoInputs = (links) => {
  const prefixIcons = [];
  const inputs = links.map((link, i) => {
    const {
      type,
      value,
      prefix,
      disabled,
      required,
      onChange,
      placeholder
    } = link;
    prefixIcons.push(prefix);

    return (
      <Input
        key={i}
        type={type}
        value={value}
        disabled={disabled}
        required={required}
        onChange={onChange}
        theme="borderless"
        subTheme="underline"
        className={cx(
          styles.tipso_input,
          styles.tipso_input_dark
        )}
        placeholder={placeholder}
      />
    )
  });

  return (
    <TipsoInputs prefixIcons={prefixIcons}>
      {inputs}
    </TipsoInputs>
  )
};

class SocialLink extends React.Component {
  componentDidMount() {
    const { total, index, social } = this.props;
    if (index === total - 1 && !social.name && !social.url) {
      this.container.click();
    }
  }

  render() {
    const {
      social,
      onChange,
      onDelete,
      className = ''
    } = this.props;
    const {
      url,
      text,
      icon,
      name,
      deleteable,
    } = social;

    const itemClass = cx(
      styles.resume_link,
      validator.url(url) && styles.active,
      className
    );

    const onInputChange = type => value => onChange({ [type]: value });

    const links = [
      {
        type: 'string',
        value: text || name,
        prefix: 'header',
        disabled: !deleteable,
        required: true,
        onChange: onInputChange('name'),
        placeholder: resumeTexts.links.addLinkName
      },
      {
        type: 'url',
        value: url,
        prefix: 'link',
        disabled: false,
        required: true,
        onChange: onInputChange('url'),
        placeholder: resumeTexts.links.addLinkUrl
      }
    ];

    return (
      <Tipso
        trigger="click"
        tipsoContent={(
          renderTipsoInputs(links)
        )}
      >
        <div className={itemClass}>
          <img src={require(`SRC/images/${icon}`)} alt={name} />
          {deleteable ? (
            <div ref={ref => (this.container = ref)} className={styles.linkDelButton}>
              <i
                className="fa fa-close"
                aria-hidden="true"
                onClick={onDelete}
              />
            </div>
          ) : null}
        </div>
      </Tipso>
    );
  }
}

export default SocialLink;

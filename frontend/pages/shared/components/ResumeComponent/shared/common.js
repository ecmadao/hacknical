import React from 'react';
import cx from 'classnames';
import styles from './common.css';
import { formatUrl } from 'UTILS/formatter';

export const renderBaseInfo = (options = {}) => {
  const {
    url,
    icon,
    value,
    type = 'normal',
    className = '',
  } = options;
  if (!value) return null;
  const iconDOM = icon
    ? <i className={`fa fa-${icon}`} aria-hidden="true" />
    : null;

  const linkClass = cx(
    styles.baseLink,
    styles.baseInfo,
    className
  );
  const textClass = cx(
    styles.baseInfo,
    className
  );
  if (type === 'email') {
    return (
      <a
        href={`mailto:${url}`}
        className={linkClass}
      >
        {iconDOM}
        {value}
      </a>
    );
  } else if (type === 'phone') {
    return (
      <a
        href={`tel:${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {iconDOM}
        {value}
      </a>
    );
  } else if (url) {
    return (
      <a
        href={formatUrl(url)}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {iconDOM}
        {value}
      </a>
    );
  }

  return (
    <span className={textClass}>
      {iconDOM}
      {value}
    </span>
  );
};

export const section = (options) => {
  const {
    rows,
    title,
    key = '',
    className = ''
  } = options;

  return (
    <div
      className={cx(
        styles.section,
        className
      )}
      key={key}
    >
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          {title}
        </div>
        <div className={styles.headerLine} />
      </div>
      {rows}
    </div>
  );
};

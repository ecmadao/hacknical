
import React from 'react'
import cx from 'classnames'
import styles from './common.css'
import Icon from 'COMPONENTS/Icon'
import { formatUrl, formatTextWithUrl } from 'UTILS/formatter'
import { isUrl } from 'UTILS/helper'

export const renderBaseInfo = (options = {}) => {
  const {
    url,
    icon,
    value,
    type = 'normal',
    className = ''
  } = options
  if (!value) return null
  const iconDOM = icon
    ? <Icon icon={icon} />
    : null

  const linkClass = cx(
    styles.baseLink,
    styles.baseInfo,
    className
  )
  const textClass = cx(
    styles.baseInfo,
    className
  )

  let href = ''
  switch (type) {
    case 'email':
      href = `mailto:${url}`
      break
    case 'phone':
      href = `tel:${url}`
      break
    case 'link':
      href = url
      break
    default:
      break
  }

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
    >
      {iconDOM}
      {value}
    </a>
  ) : (
    <span className={textClass}>
      {iconDOM}
      {value}
    </span>
  )
}

export const section = (options) => {
  const {
    rows,
    title,
    key = '',
    className = ''
  } = options

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
  )
}

export const renderTextWithUrl = text =>
  formatTextWithUrl(text).map((sec, i) => {
    const { type, value } = sec
    if (type === 'a' && isUrl(value)) {
      return (
        <a
          key={i}
          target="_blank"
          rel="noopener noreferrer"
          href={formatUrl(value)}
        >
          {value}
        </a>
      )
    }
    return (<span key={i}>{value}</span>)
  })

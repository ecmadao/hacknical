/* eslint global-require: "off" */

import React from 'react'
import cx from 'classnames'
import Img from 'react-image'
import {
  Tipso,
  Input,
  Loading,
  InputGroupV2
} from 'light-ui'
import { isUrl } from 'UTILS/helper'
import styles from '../../../styles/resume.css'
import TipsoInputs from './TipsoInputs'
import locales from 'LOCALES'
import Icon from 'COMPONENTS/Icon'

const resumeTexts = locales('resume').sections.others

const renderTipsoInputs = (links) => {
  const prefixIcons = []
  const inputs = links.map((link, i) => {
    const { Component, prefix } = link
    prefixIcons.push(prefix)

    delete link.Component
    delete link.prefix

    return (
      <Component
        key={i}
        {...link}
      />
    )
  })

  return (
    <TipsoInputs
      prefixIcons={prefixIcons}
    >
      {inputs}
    </TipsoInputs>
  )
}

class SocialLink extends React.Component {
  componentDidMount() {
    const { total, index, social } = this.props
    if (index === total - 1 && !social.name && !social.url) {
      this.container.click()
    }
  }

  render() {
    const {
      social,
      onChange,
      onDelete,
      disabled,
      className = ''
    } = this.props
    const {
      url,
      text,
      icon,
      name,
      deleteable,
    } = social

    const itemClass = cx(
      styles.resume_link,
      isUrl(url) && styles.active,
      className
    )

    const link = url ? url.replace(/^https?:\/\//, '') : ''
    const onInputChange = type => value => onChange({ [type]: value })

    const links = [
      {
        Component: Input,
        type: 'string',
        value: text || name,
        prefix: 'header',
        disabled: !deleteable,
        required: true,
        theme: 'borderless',
        subTheme: 'underline',
        className: cx(
          styles.tipso_input_dark,
          styles.tipso_input_large
        ),
        onChange: onInputChange('name'),
        placeholder: resumeTexts.links.addLinkName
      },
      {
        Component: InputGroupV2,
        sections: [
          {
            value: 'http://',
            disabled: true,
            style: {
              width: 50,
              padding: '0 5px'
            }
          },
          {
            disabled,
            type: 'url',
            prefix: 'link',
            required: true,
            style: { width: 200 },
            value: link,
            placeholder: resumeTexts.links.addLinkUrl,
            onChange: onInputChange('url')
          }
        ],
        prefix: 'link',
        style: { margin: 0 },
        theme: 'underline',
        className: styles.tipsoInputGroup
      }
    ]

    return (
      <Tipso
        trigger="click"
        tipsoContent={(
          renderTipsoInputs(links)
        )}
        className={styles.inputGroupTipso}
      >
        <div className={itemClass}>
          <Img
            alt={name}
            crossOrigin="anonymous"
            src={[
              `https://besticon-demo.herokuapp.com/icon?url=${link.replace(/^(https?:)?\/\//, '')}&size=80..120..200`,
              require(`SRC/images/${icon}`)
            ]}
            loader={
              <Loading
                loading
                className={styles.websiteLoader}
              />
            }
            unloader={
              <img src={require(`SRC/images/${icon}`)} alt={name} />
            }
          />
          {deleteable ? (
            <div ref={ref => (this.container = ref)} className={styles.linkDelButton}>
              <Icon icon="close" onClick={onDelete} />
            </div>
          ) : null}
        </div>
      </Tipso>
    )
  }
}

export default SocialLink

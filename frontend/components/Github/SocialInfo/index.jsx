/* eslint no-script-url: "off" */
import React from 'react'
import PropTypes from 'prop-types'
import github from 'UTILS/github'
import styles from './social_info.css'
import locales from 'LOCALES'
import { ClassicText, InfoCard, CardGroup } from 'light-ui'

const githubTexts = locales('github.sections.social')

const SocialInfo = (props) => {
  const {
    user,
    showLink,
    sideTextStyle
  } = props

  return (
    <div className={styles.info_content}>
      <CardGroup>
        <InfoCard cardClassName={styles.socialCard}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className={styles.info_social}
            href={showLink ? `${github.baseUrl}/${user.login}?tab=repositories` : 'javascript:void(0)'}
          >
            <ClassicText text={user.public_repos} theme="green" className={styles.infoText}/>
            <span style={sideTextStyle} className={styles.infoTextSub}>{githubTexts.repositories}</span>
          </a>
        </InfoCard>
        <InfoCard cardClassName={styles.socialCard}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className={styles.info_social}
            href={showLink ? `${github.baseUrl}/${user.login}?tab=followers` : 'javascript:void(0)'}
          >
            <ClassicText text={user.followers} theme="green" className={styles.infoText}/>
            <span style={sideTextStyle} className={styles.infoTextSub}>{githubTexts.followers}</span>
          </a>
        </InfoCard>
        <InfoCard cardClassName={styles.socialCard}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className={styles.info_social}
            href={showLink ? `${github.baseUrl}/${user.login}?tab=following` : 'javascript:void(0)'}
          >
            <ClassicText text={user.following} theme="green" className={styles.infoText}/>
            <span style={sideTextStyle} className={styles.infoTextSub}>{githubTexts.following}</span>
          </a>
        </InfoCard>
      </CardGroup>
    </div>
  )
}

SocialInfo.propTypes = {
  user: PropTypes.object,
  style: PropTypes.object,
  mainTextStyle: PropTypes.object,
  sideTextStyle: PropTypes.object,
  showLink: PropTypes.bool
}

SocialInfo.defaultProps = {
  user: {},
  style: null,
  mainTextStyle: {},
  sideTextStyle: {},
  showLink: true
}

export default SocialInfo

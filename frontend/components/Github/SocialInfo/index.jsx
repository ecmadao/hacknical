/* eslint no-script-url: "off" */
import React from 'react';
import PropTypes from 'prop-types';
import github from 'UTILS/github';
import { GREEN_COLORS } from 'UTILS/colors';
import styles from './social_info.css';
import locales from 'LOCALES';

const githubTexts = locales('github').sections.social;

const getUserCardColor = (user) => {
  const { public_repos, followers, following } = user;
  const obj = {
    public_repos,
    followers,
    following
  };
  Object.keys(obj)
    .sort(
      (thisKey, nextKey) => parseInt(obj[nextKey], 10) -    parseInt(obj[thisKey], 10))
    .forEach((key, index) => {
      obj[key] = GREEN_COLORS[index] || GREEN_COLORS.slice(-1)[0];
    });
  return obj;
};

const SocialInfo = (props) => {
  const {
    user,
    style,
    showLink,
    mainTextStyle,
    sideTextStyle
  } = props;
  const userCardColor = getUserCardColor(user);

  return (
    <div className={styles.info_content}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        className={styles.info_social}
        style={style || { backgroundColor: userCardColor.public_repos }}
        href={showLink ? `${github.baseUrl}/${user.login}?tab=repositories` : 'javascript:void(0)'}
      >
        <span style={mainTextStyle}>{user.public_repos}</span>&nbsp;
        <span style={sideTextStyle}>{githubTexts.repositories}</span>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        className={styles.info_social}
        style={style || { backgroundColor: userCardColor.followers }}
        href={showLink ? `${github.baseUrl}/${user.login}?tab=followers` : 'javascript:void(0)'}
      >
        <span style={mainTextStyle}>{user.followers}</span>&nbsp;
        <span style={sideTextStyle}>{githubTexts.followers}</span>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        className={styles.info_social}
        style={style || { backgroundColor: userCardColor.following }}
        href={showLink ? `${github.baseUrl}/${user.login}?tab=following` : 'javascript:void(0)'}
      >
        <span style={mainTextStyle}>{user.following}</span>&nbsp;
        <span style={sideTextStyle}>{githubTexts.following}</span>
      </a>
    </div>
  );
};

SocialInfo.propTypes = {
  user: PropTypes.object,
  style: PropTypes.object,
  mainTextStyle: PropTypes.object,
  sideTextStyle: PropTypes.object,
  showLink: PropTypes.bool
};

SocialInfo.defaultProps = {
  user: {},
  style: null,
  mainTextStyle: {},
  sideTextStyle: {},
  showLink: true
};

export default SocialInfo;

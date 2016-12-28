import React, { PropTypes } from 'react';
import github from 'UTILS/github';
import { GREEN_COLORS } from 'UTILS/colors';
import './social_info.css';

const getUserCardColor = (user) => {
  const {public_repos, followers, following} = user;
  const obj = {
    public_repos,
    followers,
    following
  };
  Object.keys(obj).sort((thisKey, nextKey) => {
    return parseInt(obj[nextKey]) - parseInt(obj[thisKey]);
  }).forEach((key, index) => {
    obj[key] = GREEN_COLORS[index];
  });
  return obj;
};

const SocialInfo = (props) => {
  const { user, style } = props;
  const userCardColor = getUserCardColor(user);

  return (
    <div className="info_content">
      <a
        target="_blank"
        className="info_social"
        style={style || {backgroundColor: userCardColor['public_repos']}}
        href={`${github.baseUrl}/${user.login}?tab=repositories`}>
        <span style={style ? { color: style.color } : {}}>{user['public_repos']}</span>&nbsp;
        <span style={style ? { color: style.color } : {}}>repositories</span>
      </a>
      <a
        target="_blank"
        className="info_social"
        style={style || {backgroundColor: userCardColor['followers']}}
        href={`${github.baseUrl}/${user.login}?tab=followers`}>
        <span style={style ? { color: style.color } : {}}>{user.followers}</span>&nbsp;
        <span style={style ? { color: style.color } : {}}>followers</span>
      </a>
      <a
        target="_blank"
        className="info_social"
        style={style || {backgroundColor: userCardColor['following']}}
        href={`${github.baseUrl}/${user.login}?tab=following`}>
        <span style={style ? { color: style.color } : {}}>{user.following}</span>&nbsp;
        <span style={style ? { color: style.color } : {}}>following</span>
      </a>
    </div>
  )
};

SocialInfo.propTypes = {
  user: PropTypes.object,
  style: PropTypes.object,
};

SocialInfo.defaultProps = {
  user: {},
  style: null
};

export default SocialInfo;

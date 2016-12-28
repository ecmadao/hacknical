import React from 'react';
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
  const { user } = props;
  const userCardColor = getUserCardColor(user);

  return (
    <div className="info_content">
      <a
        target="_blank"
        className="info_social"
        style={{backgroundColor: userCardColor['public_repos']}}
        href={`${github.baseUrl}/${user.login}?tab=repositories`}>
        <span>{user['public_repos']}</span>&nbsp;
        <span>repositories</span>
      </a>
      <a
        target="_blank"
        className="info_social"
        style={{backgroundColor: userCardColor['followers']}}
        href={`${github.baseUrl}/${user.login}?tab=followers`}>
        <span>{user.followers}</span>&nbsp;
        <span>followers</span>
      </a>
      <a
        target="_blank"
        className="info_social"
        style={{backgroundColor: userCardColor['following']}}
        href={`${github.baseUrl}/${user.login}?tab=following`}>
        <span>{user.following}</span>&nbsp;
        <span>following</span>
      </a>
    </div>
  )
};

export default SocialInfo;

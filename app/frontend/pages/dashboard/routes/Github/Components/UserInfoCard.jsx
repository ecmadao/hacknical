import React from 'react';
import { GREEN_COLORS } from 'UTILS/colors';
import github from 'UTILS/github';

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

const UserInfoCard = (props) => {
  const { user } = props;
  if (!user) { return (<div></div>) }
  const userCardColor = getUserCardColor(user);
  return (
    <div className="info_card_container">
      <p><i aria-hidden="true" className="fa fa-vcard-o"></i>&nbsp;&nbsp;基本信息</p>
      <div className="info_card card">
        <div className="info_header">
          <div className="info_avator">
            <img src={user['avatar_url']} />
          </div>
          <div className="info_user">
            <a href={`${github.baseUrl}/${user.login}`} target="_blank">{user.name}</a>
            <span>加入时间：{user['created_at'].split('T')[0]}</span>
            {user.bio ? <blockquote>{user.bio}</blockquote> : ''}
          </div>
        </div>
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
      </div>
    </div>
  )
};

export default UserInfoCard;

import React from 'react';

const UserInfoCard = (props) => {
  const {user} = props;
  return (
    <div className="info_card_container">
      <p>基本信息</p>
      <div className="info_card card">
        <div className="info_header">
          <div className="info_avator">
            <img src={user['avatar_url']} />
          </div>
          <div className="info_user">
            <h3>{user.name}</h3>
            <span>加入时间：{user['created_at'].split('T')[0]}</span>
            {user.bio ? <blockquote>{user.bio}</blockquote> : ''}
          </div>
        </div>
        <div className="info_content">
          <a
            target="_blank"
            className="info_social"
            href={`https://github.com/${user.login}?tab=repositories`}>
            <span>{user['public_repos']}</span>&nbsp;
            <span>repositories</span>
          </a>
          <a
            target="_blank"
            className="info_social"
            href={`https://github.com/${user.login}?tab=followers`}>
            <span>{user.followers}</span>&nbsp;
            <span>followers</span>
          </a>
          <a
            target="_blank"
            className="info_social"
            href={`https://github.com/${user.login}?tab=following`}>
            <span>{user.following}</span>&nbsp;
            <span>following</span>
          </a>
        </div>
      </div>
    </div>
  )
};

export default UserInfoCard;

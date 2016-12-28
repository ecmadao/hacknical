import React from 'react';
import github from 'UTILS/github';
import SocialInfo from './shared/SocialInfo';

const UserInfoCard = (props) => {
  const { user } = props;
  if (!user) { return (<div></div>) }
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
        <SocialInfo user={user} />
      </div>
    </div>
  )
};

export default UserInfoCard;
